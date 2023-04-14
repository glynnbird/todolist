resource "cloudflare_workers_kv_namespace" "todolist_kv" {
  account_id = var.cloudflare_account_id
  title      = "todolist-${terraform.workspace}"
}

output "kv_id" {
  value = cloudflare_workers_kv_namespace.todolist_kv.id
}