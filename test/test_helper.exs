ExUnit.start

Mix.Task.run "ecto.create", ~w(-r Chatex.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r Chatex.Repo --quiet)
Ecto.Adapters.SQL.Sandbox.mode(Chatex.Repo, :manual)
