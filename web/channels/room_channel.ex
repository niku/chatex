defmodule Chatex.RoomChannel do
  use Chatex.Web, :channel

  def join("rooms:lobby", _message, socket) do
    {:ok, socket}
  end

  def handle_in("sync_todo", payload, socket) do
    broadcast! socket, "sync_todo", payload
    {:noreply, socket}
  end
end
