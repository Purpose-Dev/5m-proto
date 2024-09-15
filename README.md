# Project Name

## Overview

This project is a TypeScript-based lib that deals with encoding, decoding, and extracting data. It utilizes Protocol Buffers (protobufjs) for message serialization, and employs a set of custom modules for handling these operations.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Examples](#examples)
- [License](#license)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Purpose-Dev/5m-proto.git
    cd 5m-proto
    ```

2. **Install dependencies using pnpm:**

    ```sh
    pnpm add 5m-proto
    ```

## Usage

To get started with the project:

1. **Build the project:**

    ```sh
    pnpm run build
    ```

2. **Run tests:**

    ```sh
    pnpm test
    ```

## Project Structure

The project structure includes several TypeScript files with specific purposes:

- **index.ts:** Main entry point exporting core functionalities from other modules.
- **decode.ts:** Contains functions for decoding buffers.
- **encode.ts:** Responsible for loading and encoding messages.
- **extractData.ts:** Functions for extracting data from various sources.
- **Payload.ts:** Defines and handles payload structures.

```typescript
// index.ts
export { decodeBuffer } from "./decode";
export { loadAndEncodeMessage } from "./encode";
export { extractData } from "./extractData";
export { Payload } from "./Payload";
```

## Contributing

We welcome contributions! Please fork the repository and submit a pull request for any changes you would like to contribute.

1. **Fork the repository**
2. **Create a new branch**

    ```sh
    git checkout -b feature-branch
    ```

3. **Make your changes**
4. **Commit your changes**

    ```sh
    git commit -m "Description of changes"
    ```

5. **Push to your branch**

    ```sh
    git push origin feature-branch
    ```

6. **Open a pull request**

## Examples
- proto file
```protobuf
syntax = "proto3";

package fivem;

message Position {
  float x = 1;
  float y = 2;
  float z = 3;
}

message Vehicle {
  string model = 1;
  string plate = 2;
  Position position = 3;
  bool is_owned = 4;
}

message WeaponAccessory {
  string name = 1;
}

message Weapon {
  string name = 1;
  int32 ammo_count = 2;
  repeated WeaponAccessory accessories = 3;
}

message Player {
  int32 id = 1;
  string name = 2;
  Position position = 3;
  int32 health = 4;
  int32 armor = 5;
  float cash = 6;
  float bank = 7;
  string job = 8;
  repeated Weapon weapon = 9;
  Vehicle current_vehicle = 10;
}
```

Server Part:
```typescript
import { loadAndEncodeMessage } from "5m-proto";
import {Player} from "@protoDefs/fivem_pb";
import * as path from "path";

const protoPath = path.join(GetCurrentResourceName(), "proto");

const payload: Player = {
   id: 1,
   name: "John Doe",
   position: {
      x: 129.99,
      y: 512.47,
      z: 487.45
   },
   health: 154,
   armor: 80,
   cash: 1050.25,
   bank: 475.87,
   job: "developer",
   weapon: [
      {
         name: "Pistol",
         ammo: 30,
         accessories: [
            {
               name: "Silencer",
            },
            {
               name: "Extended Magazine",
            }
         ]
      }
   ],
   currentVehicle: {
      model: "Zentorno",
      plate: "ABC123",
      position: {
         x: 129.99,
         y: 512.47,
         z: 487.45
      },
      isOwned: false,
   },
};

RegisterCommand("sendData", async () => {
   console.log("Sending data...");
   const encoded = await loadAndEncodeMessage(`${protoPath}/awesome.proto`, "fivem.Player", payload);
   emitNet("proto:SendPlayerData", 1, encoded);
   console.log("Data sent");
}, false);
```

Client Part:
```typescript
import { decodeBuffer, extractData } from "5m-proto";
import {Player} from "@protoDefs/fivem_pb";

onNet("proto:SendPlayerData", (encodedData: Uint8Array) => {
    const decodedData = decodeBuffer(encodedData, `${GetCurrentResourceName()}/proto/awesome.proto`, "fivem.Player");
    const playerData: Player = extractData(decodedData);
    console.log(playerData);
});
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.