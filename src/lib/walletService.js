import { supabase } from "./supabase";

/* ดึงยอดเงิน */

export async function getBalance(userId){

    const {data,error}=await supabase

    .from("profiles")

    .select("balance")

    .eq("id",userId)

    .single();

    if(error) throw error;

    return data.balance;

}

/* เพิ่มเงิน */

export async function addBalance(userId,amount){

    const balance=await getBalance(userId);

    const {error}=await supabase

    .from("profiles")

    .update({

        balance:Number(balance)+Number(amount)

    })

    .eq("id",userId);

    if(error) throw error;

}

/* หักเงิน */

export async function subtractBalance(userId,amount){

    const balance=await getBalance(userId);

    if(Number(balance)<Number(amount))

        throw new Error("Balance not enough");

    const {error}=await supabase

    .from("profiles")

    .update({

        balance:Number(balance)-Number(amount)

    })

    .eq("id",userId);

    if(error) throw error;

}

/* โอนเงิน */

export async function transferBalance(

    fromUser,

    toUser,

    amount

){

    await subtractBalance(

        fromUser,

        amount

    );

    await addBalance(

        toUser,

        amount

    );

}