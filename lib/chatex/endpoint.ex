defmodule Chatex.Endpoint do
  use Phoenix.Endpoint, otp_app: :chatex

  socket "/socket", Chatex.UserSocket

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :chatex, gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt)

  # Load JavaScript library from "node_modules" directory.
  plug Plug.Static,
    at: "/js/vendor", from: "node_modules", gzip: false,
    only: ~w(requirejs mithril)

  # Load phoenix_html library from "phoenix_html" dependency
  plug Plug.Static,
   at: "/js/vendor", from: "deps/phoenix_html/priv/static", gzip: false,
   only: ~w(phoenix_html.js)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.Session,
    store: :cookie,
    key: "_chatex_key",
    signing_salt: "8o1p/AFW"

  plug Chatex.Router
end
