# API key needed to access the API
resource "random_string" "apiKey" {
  length           = 20
  special          = false
  upper            = false
  lower            = true
}
output apiKey {
  value = random_string.apiKey.id
}

# // add a new Todo
# resource "cloudflare_worker_script" "add_todo_worker" {
#   account_id = var.cloudflare_account_id
#   name       = "add_todo_${terraform.workspace}"
#   content    = file("../code/dist/add_todo.js")
#   module     = true

#   // bind the KV service to this worker
#   kv_namespace_binding {
#     name         = "TODOLIST"
#     namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
#   }
# }

# // list all Todos
# resource "cloudflare_worker_script" "list_todos_worker" {
#   account_id = var.cloudflare_account_id
#   name       = "list_todos_${terraform.workspace}"
#   content    = file("../code/dist/list_todos.js")
#   module     = true

#   // bind the KV service to this worker
#   kv_namespace_binding {
#     name         = "TODOLIST"
#     namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
#   }
# }

# // delete a single Todo
# resource "cloudflare_worker_script" "delete_todo_worker" {
#   account_id = var.cloudflare_account_id
#   name       = "delete_todo_${terraform.workspace}"
#   content    = file("../code/dist/delete_todo.js")
#   module     = true

#   // bind the KV service to this worker
#   kv_namespace_binding {
#     name         = "TODOLIST"
#     namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
#   }
# }

# // get a single Todo by ids
# resource "cloudflare_worker_script" "get_todo_worker" {
#   account_id = var.cloudflare_account_id
#   name       = "get_todo_${terraform.workspace}"
#   content    = file("../code/dist/get_todo.js")
#   module     = true

#   // bind the KV service to this worker
#   kv_namespace_binding {
#     name         = "TODOLIST"
#     namespace_id = cloudflare_workers_kv_namespace.todolist_kv.id
#   }
# }

# // router worker that is the first thing called with every incoming HTTP request
# resource "cloudflare_worker_script" "router_worker" {
#   account_id = var.cloudflare_account_id
#   name       = "router_${terraform.workspace}"
#   content    = file("../code/dist/router.js")
#   module     = true

#   // bind the other workers to this router worker
#   // so that it can invoke any worker according to the incoming request
#   service_binding {
#     name        = "WORKER_ADD_TODO"
#     service     = cloudflare_worker_script.add_todo_worker.name
#     environment = "production" 
#   }
#   service_binding {
#     name        = "WORKER_LIST_TODOS"
#     service     = cloudflare_worker_script.list_todos_worker.name
#     environment = "production" 
#   }
#   service_binding {
#     name        = "WORKER_GET_TODO"
#     service     = cloudflare_worker_script.get_todo_worker.name
#     environment = "production" 
#   }
#   service_binding {
#     name        = "WORKER_DELETE_TODO"
#     service     = cloudflare_worker_script.delete_todo_worker.name
#     environment = "production" 
#   }

#   // let the router know the api key
#   plain_text_binding {
#     name = "API_KEY"
#     text = random_string.apiKey.id
#   }
# }

# // the router worker is bound to its own custom domain name (DNS record)
# resource "cloudflare_worker_domain" "worker_domain" {
#   account_id = var.cloudflare_account_id
#   hostname   = var.cloudflare_domain
#   service    = cloudflare_worker_script.router_worker.name
#   zone_id    = var.cloudflare_zone_id
# }
