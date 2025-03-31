# How to Connect and Read Data from the Game WebSocket Server
This guide explains how to connect to the WebSocket server and retrieve game data in real-time. The WebSocket server is implemented in the file [`GameWebSocketServer.ts`](../src/main/services/gameWebSocketServer/GameWebSocketServer.ts), and the data structure used for transmitting information is defined in [`mapGameData.ts`](../src/main/services/gameWebSocketServer/mapGameData.ts).

## WebSocket Server URL

The WebSocket server runs on the following URL:

```
ws://localhost:49791
```

### Query Parameter: `q`

To specify the fields you want to retrieve, include a `q` query parameter in the WebSocket URL. The `q` parameter should contain a comma-separated list of fields. For example:

```
ws://localhost:49791?q=realtime.throttle,realtime.brake
```

### Field Limitations

- You must request at least **1 field**.
- You can request up to **30 fields**.

If these conditions are not met, the server will reject the connection.

## Data Structure

The data transmitted by the WebSocket server is sent in one of two formats:

1. **Array of Key-Value Pairs**  
  This format represents fields that have changed as an array of key-value pairs. Below is an example:

  ```json
  [
    ["realtime.throttle", 0.8],
    ["realtime.brake", 0.2],
    ["sessionInfo.currentTime", 12319595719],
    ["sessionInfo.drivers[].id", [1, 2]],
    ["sessionInfo.drivers[].name", ["Jack", "John"]]
  ]
  ```

  Each entry in the array represents a field that has changed, with the first element being the field name and the second element being the new value.

2. **Full Object or Array**  
  If the user requests a field that represents an entire object or array, the server will send the complete object or array. Below is an example:

  ```json
  {
    "sessionInfo": {
     "currentTime": 12319595719,
     "drivers": [
      { "id": 1, "name": "Jack", "team": "Alpha" },
      { "id": 2, "name": "John", "team": "Beta" }
     ]
    }
  }
  ```

  In this case, the entire `sessionInfo` object is sent because the user requested it as a whole. Similarly, if a user requests an array field, the entire array with all its elements will be transmitted.

Each format is designed to provide flexibility based on the user's request, ensuring efficient data transmission while accommodating different use cases.
