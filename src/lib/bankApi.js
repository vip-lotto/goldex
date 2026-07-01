import { supabase } from "./supabase";

// โหลดบัญชีธนาคารทั้งหมด
export async function getBank(userId) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("id", { ascending: true });

  if (error) throw error;

  return data;
}

// เพิ่มบัญชีธนาคาร
export async function addBank(values) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// แก้ไขบัญชีธนาคาร
export async function updateBank(id, values) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ลบบัญชีธนาคาร
export async function deleteBank(id) {
  const { error } = await supabase
    .from("bank_accounts")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ตั้งเป็นบัญชีหลัก
export async function setPrimaryBank(userId, bankId) {

  // ยกเลิกบัญชีหลักทั้งหมดก่อน
  await supabase
    .from("bank_accounts")
    .update({ is_default: false })
    .eq("user_id", userId);

  // ตั้งบัญชีใหม่เป็นหลัก
  const { error } = await supabase
    .from("bank_accounts")
    .update({ is_default: true })
    .eq("id", bankId);

  if (error) throw error;

}

// ตรวจสอบก่อนเพิ่มบัญชี
export async function validateBank(userId, bankName, fullName, accountNumber) {

  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  // จำกัดไม่เกิน 5 บัญชี
  if (data.length >= 5) {
    throw new Error("สามารถผูกบัญชีได้สูงสุด 5 บัญชี");
  }

  // ชื่อเจ้าของบัญชีต้องตรงกันทุกบัญชี
  if (data.length > 0) {
    const owner = (data[0].full_name || data[0].account_name)
      .trim()
      .toLowerCase();

  if (owner !== fullName.trim().toLowerCase()) {

      throw new Error("ชื่อเจ้าของบัญชีไม่ตรงกับบัญชีที่ผูกไว้");
    }
  }

  // ห้ามซ้ำทั้งธนาคาร + เลขบัญชี
  const duplicate = data.find(
    item =>
      item.bank_name === bankName &&
      item.account_number === accountNumber
  );

  if (duplicate) {
    throw new Error("บัญชีธนาคารนี้ถูกผูกไว้แล้ว");
  }

  return true;
}

// ดึงบัญชีหลักของลูกค้า
export async function getPrimaryBank(userId) {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_default", true)
    .single();

  if (error) throw error;

  return data;
}