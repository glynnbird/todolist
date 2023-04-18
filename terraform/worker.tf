resource "cloudflare_worker_script" "add_todo_worker" {
  account_id = var.cloudflare_account_id
  name       = "add_todo_${terraform.workspace}"
  content    = file("../code/dist/add_todo.js")
  module     = true

  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
  }
}

resource "cloudflare_worker_route" "add_todo_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.cloudflare_domain}/add"
  script_name = cloudflare_worker_script.add_todo_worker.name
}

output "add_api_url" {
  value       = cloudflare_worker_route.add_todo_route.pattern
}


resource "cloudflare_worker_script" "list_todos_worker" {
  account_id = var.cloudflare_account_id
  name       = "list_todos_${terraform.workspace}"
  content    = file("../code/dist/list_todos.js")
  module     = true

  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
  }
}

resource "cloudflare_worker_route" "list_todos_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.cloudflare_domain}/list"
  script_name = cloudflare_worker_script.list_todos_worker.name
}

output "list_api_url" {
  value       = cloudflare_worker_route.list_todos_route.pattern
}

resource "cloudflare_worker_script" "delete_todo_worker" {
  account_id = var.cloudflare_account_id
  name       = "delete_todo_${terraform.workspace}"
  content    = file("../code/dist/delete_todo.js")
  module     = true

  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
  }
}

resource "cloudflare_worker_route" "delete_todo_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.cloudflare_domain}/delete"
  script_name = cloudflare_worker_script.delete_todo_worker.name
}

output "delete_api_url" {
  value       = cloudflare_worker_route.delete_todo_route.pattern
}

resource "cloudflare_worker_script" "get_todo_worker" {
  account_id = var.cloudflare_account_id
  name       = "get_todo_${terraform.workspace}"
  content    = file("../code/dist/get_todo.js")
  module     = true

  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
  }
}

resource "cloudflare_worker_route" "get_todo_route" {
  zone_id     = var.cloudflare_zone_id
  pattern     = "${var.cloudflare_domain}/get"
  script_name = cloudflare_worker_script.get_todo_worker.name
}

output "get_api_url" {
  value       = cloudflare_worker_route.get_todo_route.pattern
}

# resource "cloudflare_worker_route" "add_todo_route" {
#   zone_id     = var.cloudflare_zone_id
#   pattern     = "glynnbird.com/*"
#   script_name = cloudflare_worker_script.add_todo_worker.name
# }

# resource "cloudflare_worker_route" "add_todo_route" {
#   zone_id     = var.cloudflare_zone_id
#   pattern     = "todo.glynnbird.com/add"
#   script_name = cloudflare_worker_script.add_todo_worker.name
# }

