import { updateAccount } from "@/lib/account-proxy";
export const dynamic = "force-dynamic";
export async function PUT(request: Request) {
  return updateAccount(request, "password");
}
