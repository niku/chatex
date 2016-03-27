defmodule Chatex.LayoutView do
  use Chatex.Web, :view

  def js_vendor_static_path(%Plug.Conn{private: private} = conn, path) do
    private.phoenix_endpoint.static_path("/js/vendor" <> path)
  end
end
