import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./AdminDeposit.css";

import { useNavigate } from "react-router-dom";


export default function AdminDeposit() {

  const navigate = useNavigate();

  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedDeposit, setSelectedDeposit] = useState(null);

  const [approveLoading, setApproveLoading] =
    useState(false);

  const [rejectLoading, setRejectLoading] =
    useState(false);

  useEffect(() => {

    loadDeposits();

  }, []);

    const loadDeposits = async () => {

    setLoading(true);

    const { data, error } =
      await supabase
        .from("deposits")
        .select(`
          *,
          profiles(
            id,
            member_id,
            first_name,
            last_name,
            phone,
            balance
          )
        `)
        .order("id", {
          ascending: false
        });

    if (error) {

      console.error(error);

      setLoading(false);

      return;

    }

    setDeposits(data || []);

    setLoading(false);

  };

  const filteredDeposits = useMemo(() => {

    return deposits.filter((item) => {

      const keyword =
        search
          .trim()
          .toLowerCase();

      const fullname =
        `${item.profiles?.first_name || ""} ${item.profiles?.last_name || ""}`
          .toLowerCase();

      const phone =
        item.profiles?.phone || "";

      const memberId =
        String(
          item.profiles?.member_id || ""
        );

      const matchKeyword =

        keyword === "" ||

        fullname.includes(keyword) ||

        phone.includes(keyword) ||

        memberId.includes(keyword) ||

        String(item.id).includes(keyword) ||

        String(item.user_id).includes(keyword);

      const matchStatus =

        statusFilter === "all"

          ? true

          : item.status === statusFilter;

      return (

        matchKeyword &&

        matchStatus

      );

    });

  }, [

    deposits,

    search,

    statusFilter

  ]);

  const totalPending =
    deposits.filter(
      item =>
        item.status === "pending"
    ).length;

  const totalApproved =
    deposits.filter(
      item =>
        item.status === "approved"
    ).length;

  const totalRejected =
    deposits.filter(
      item =>
        item.status === "rejected"
    ).length;

  const totalAmount =
    deposits
      .filter(
        item =>
          item.status === "approved"
      )
      .reduce(

        (sum, item) =>

          sum +
          Number(item.amount || 0),

        0

      );

        const approveDeposit = async (item) => {

    if (
      item.status !== "pending"
    ) {

      alert(
        "รายการนี้ดำเนินการแล้ว"
      );

      return;

    }

    const amount = prompt(
      "กรอกจำนวนเงินที่ต้องการเติม",
      item.amount || ""
    );

    if (amount === null) return;

    const depositAmount =
      Number(amount);

    if (
      isNaN(depositAmount) ||
      depositAmount <= 0
    ) {

      alert(
        "จำนวนเงินไม่ถูกต้อง"
      );

      return;

    }

    setApproveLoading(true);

    const {
      data: profile,
      error: profileError
    } =
      await supabase
        .from("profiles")
        .select("*")
        .eq(
          "id",
          item.user_id
        )
        .single();

    if (
      profileError ||
      !profile
    ) {

      setApproveLoading(false);

      alert(
        "ไม่พบข้อมูลผู้ใช้"
      );

      return;

    }

    const {
      data: wallet
    } =
      await supabase
        .from("wallets")
        .select("*")
        .eq(
          "user_id",
          item.user_id
        )
        .single();

    const {
      data: asset
    } =
      await supabase
        .from("user_assets")
        .select("*")
        .eq(
          "user_id",
          item.user_id
        )
        .eq(
          "symbol",
          "USDT"
        )
        .single();

    const newProfileBalance =
      Number(profile.balance || 0) +
      depositAmount;

    const newWalletBalance =
      Number(wallet?.balance || 0) +
      depositAmount;

    const newAssetBalance =
      Number(asset?.balance || 0) +
      depositAmount;

    const {
      error: profileUpdateError
    } =
      await supabase
        .from("profiles")
        .update({

          balance:
            newProfileBalance

        })
        .eq(
          "id",
          item.user_id
        );

    if (
      profileUpdateError
    ) {

      setApproveLoading(false);

      alert(
        "อัปเดต Profile ไม่สำเร็จ"
      );

      return;

    }

    if (wallet) {

      await supabase
        .from("wallets")
        .update({

          balance:
            newWalletBalance

        })
        .eq(
          "id",
          wallet.id
        );

    }

    if (asset) {

      await supabase
        .from("user_assets")
        .update({

          balance:
            newAssetBalance

        })
        .eq(
          "id",
          asset.id
        );

    } else {

      await supabase
        .from("user_assets")
        .insert({

          user_id:
            item.user_id,

          symbol:
            "USDT",

          balance:
            depositAmount

        });

    }

        await supabase
      .from("deposits")
      .update({

        status: "approved",

        amount: depositAmount

      })
      .eq(
        "id",
        item.id
      );

    await supabase
  .from("notifications")
  .insert([
    {
      user_id: item.user_id,

      title_key: "depositSuccess",

      message_key: "depositApproved",

      coin: item.coin,

      network: item.network,

      amount: depositAmount,

      status: "success",

      type: "deposit"
    }
  ]);
    await supabase
      .from("transactions")
      .insert([

        {

          user_id:
            item.user_id,

          type:
            "deposit",

          symbol:
            "USDT",

          amount:
            depositAmount,

          balance:
            newProfileBalance,

          status:
            "completed",

          remark:
            `Deposit ${item.coin}`

        }

      ]);

    setApproveLoading(false);

    alert(
      "อนุมัติสำเร็จ"
    );

    window.dispatchEvent(new Event("walletUpdated"));


    loadDeposits();

  };

  const rejectDeposit = async (item) => {

    if (
      item.status !== "pending"
    ) {

      alert(
        "รายการนี้ดำเนินการแล้ว"
      );

      return;

    }

    if (
      !window.confirm(
        "ยืนยันการปฏิเสธรายการนี้ ?"
      )
    ) {

      return;

    }

    setRejectLoading(true);

    await supabase
      .from("deposits")
      .update({

        status:
          "rejected"

      })
      .eq(
        "id",
        item.id
      );

    await supabase
  .from("notifications")
  .insert([
    {
      user_id: item.user_id,

      title_key: "depositFailed",

      message_key: "depositRejected",

      coin: item.coin,

      network: item.network,

      amount: Number(item.amount),

      status: "failed",

      type: "deposit"
    }
  ]);

    setRejectLoading(false);

    alert(
      "ปฏิเสธสำเร็จ"
    );

    loadDeposits();

  };

    return (

    <div className="admin-deposit">

      <div className="admin-header">

  <button
    className="back-btn"
    onClick={() => navigate(-1)}
  >
    ← Back
  </button>

  <div>

    <h2>
      Deposit Management
    </h2>

    <p>
      GoldEx Admin Panel
    </p>

  </div>

</div>

      <div className="admin-summary">

        <div className="summary-card">

          <span>Pending</span>

          <h3>
            {totalPending}
          </h3>

        </div>

        <div className="summary-card">

          <span>Approved</span>

          <h3>
            {totalApproved}
          </h3>

        </div>

        <div className="summary-card">

          <span>Rejected</span>

          <h3>
            {totalRejected}
          </h3>

        </div>

        <div className="summary-card">

          <span>Total Deposit</span>

          <h3>
            {totalAmount.toLocaleString()}
          </h3>

        </div>

      </div>

      <div className="admin-toolbar">

        <input

          type="text"

          placeholder="Search..."

          value={search}

          onChange={(e)=>

            setSearch(
              e.target.value
            )

          }

        />

        <select

          value={statusFilter}

          onChange={(e)=>

            setStatusFilter(
              e.target.value
            )

          }

        >

          <option value="all">
            All
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="rejected">
            Rejected
          </option>

        </select>

      </div>

      <div className="table-wrap">

        <table className="admin-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Member</th>

              <th>Name</th>

              <th>Phone</th>

              <th>Coin</th>

              <th>Network</th>

              <th>Amount</th>

              <th>Slip</th>

              <th>Status</th>

              <th>Date</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>


                        {loading && (

              <tr>

                <td
                  colSpan="11"
                  className="empty"
                >
                  Loading...
                </td>

              </tr>

            )}

            {!loading &&
              filteredDeposits.length === 0 && (

              <tr>

                <td
                  colSpan="11"
                  className="empty"
                >
                  No Deposit
                </td>

              </tr>

            )}

            {!loading &&
              filteredDeposits.map((item) => (

                <tr key={item.id}>

                  <td>
                    #{item.id}
                  </td>

                  <td>
                    {item.profiles?.member_id || "-"}
                  </td>

                  <td>

                    {item.profiles?.first_name}{" "}
                    {item.profiles?.last_name}

                  </td>

                  <td>
                    {item.profiles?.phone || "-"}
                  </td>

                  <td>
                    {item.coin}
                  </td>

                  <td>
                    {item.network}
                  </td>

                  <td>
                    {Number(
                      item.amount || 0
                    ).toLocaleString()}
                  </td>

                  <td>

                    {item.slip_url ? (

                      <a
                        href={item.slip_url}
                        target="_blank"
                        rel="noreferrer"
                        className="slip-link"
                      >
                        View Slip
                      </a>

                    ) : (

                      "-"

                    )}

                  </td>

                  <td>

                    <span
                      className={
                        item.status === "approved"

                          ? "status approved"

                          : item.status === "rejected"

                          ? "status rejected"

                          : "status pending"
                      }
                    >
                      {item.status}
                    </span>

                  </td>

                  <td>

                    {item.created_at
                      ? new Date(
                          item.created_at
                        ).toLocaleString()
                      : "-"}

                  </td>

                  <td>

                                        {item.status === "pending" ? (

                      <div className="action-group">

                        <button
                          className="approve-btn"
                          disabled={approveLoading}
                          onClick={() =>
                            approveDeposit(item)
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          disabled={rejectLoading}
                          onClick={() =>
                            rejectDeposit(item)
                          }
                        >
                          Reject
                        </button>

                      </div>

                    ) : (

                      <span className="done-text">

                        Completed

                      </span>

                    )}

                  </td>

                </tr>

              ))

            }

          </tbody>

        </table>

      </div>

          </div>

  );

}