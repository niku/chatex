ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Chatex.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Chatex.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(Chatex.Repo)

