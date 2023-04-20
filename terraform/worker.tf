resource "cloudflare_worker_script" "add_todo_worker" {
  account_id = var.cloudflare_account_id
  name       = "add_todo_${terraform.workspace}"
  content    = file("../code/dist/add_todo.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
  }
}

resource "cloudflare_worker_script" "list_todos_worker" {
  account_id = var.cloudflare_account_id
  name       = "list_todos_${terraform.workspace}"
  content    = file("../code/dist/list_todos.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
  }
}

resource "cloudflare_worker_script" "delete_todo_worker" {
  account_id = var.cloudflare_account_id
  name       = "delete_todo_${terraform.workspace}"
  content    = file("../code/dist/delete_todo.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
  }
}

resource "cloudflare_worker_script" "get_todo_worker" {
  account_id = var.cloudflare_account_id
  name       = "get_todo_${terraform.workspace}"
  content    = file("../code/dist/get_todo.js")
  module     = true

  // bind the KV service to this worker
  kv_namespace_binding {
    name         = "TODOLIST"
    namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
  }
}

resource "cloudflare_worker_script" "router_worker" {
  account_id = var.cloudflare_account_id
  name       = "router_${terraform.workspace}"
  content    = file("../code/dist/router.js")
  module     = true

  // bind the other workers to this router worker
  // so that it can invoke any worker according to the incoming request
  service_binding {
    name        = "WORKER_ADD_TODO"
    service     = cloudflare_worker_script.add_todo_worker.name
  }
  service_binding {
    name        = "WORKER_LIST_TODOS"
    service     = cloudflare_worker_script.list_todos_worker.name
  }
  service_binding {
    name        = "WORKER_GET_TODO"
    service     = cloudflare_worker_script.get_todo_worker.name
  }
  service_binding {
    name        = "WORKER_DELETE_TODO"
    service     = cloudflare_worker_script.delete_todo_worker.name
  }
}


resource "cloudflare_worker_domain" "worker_domain" {
  account_id = var.cloudflare_account_id
  hostname   = "${var.cloudflare_domain}"
  service    = cloudflare_worker_script.router_worker.name
  zone_id    = var.cloudflare_zone_id
}