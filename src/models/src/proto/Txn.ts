/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "ethereum";

export interface ITxn {
  hash: string;
  sender: string;
  receiver?: string;
  amount: string;
  gas: string;
  block?: number;
  blockHash?: string;
  note: string;
}

function createBaseITxn(): ITxn {
  return { hash: "", sender: "", receiver: "", amount: "", gas: "", block: 0, blockHash: "", note: "" };
}

export const ITxn = {
  encode(message: ITxn, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    if (message.sender !== "") {
      writer.uint32(18).string(message.sender);
    }
    if (message.receiver && message.receiver !== "") {
      writer.uint32(26).string(message.receiver);
    }
    if (message.amount !== "") {
      writer.uint32(34).string(message.amount);
    }
    if (message.gas !== "") {
      writer.uint32(42).string(message.gas);
    }
    if (message.block && message.block !== 0) {
      writer.uint32(48).uint64(message.block);
    }
    if (message.blockHash && message.blockHash !== "") {
      writer.uint32(58).string(message.blockHash);
    }
    if (message.note !== "") {
      writer.uint32(66).string(message.note);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ITxn {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseITxn();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hash = reader.string();
          break;
        case 2:
          message.sender = reader.string();
          break;
        case 3:
          message.receiver = reader.string();
          break;
        case 4:
          message.amount = reader.string();
          break;
        case 5:
          message.gas = reader.string();
          break;
        case 6:
          message.block = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.blockHash = reader.string();
          break;
        case 8:
          message.note = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ITxn {
    return {
      hash: isSet(object.hash) ? String(object.hash) : "",
      sender: isSet(object.sender) ? String(object.sender) : "",
      receiver: isSet(object.receiver) ? String(object.receiver) : "",
      amount: isSet(object.amount) ? String(object.amount) : "",
      gas: isSet(object.gas) ? String(object.gas) : "",
      block: isSet(object.block) ? Number(object.block) : 0,
      blockHash: isSet(object.blockHash) ? String(object.blockHash) : "",
      note: isSet(object.note) ? String(object.note) : "",
    };
  },

  toJSON(message: ITxn): unknown {
    const obj: any = {};
    message.hash !== undefined && (obj.hash = message.hash);
    message.sender !== undefined && (obj.sender = message.sender);
    message.receiver !== undefined && (obj.receiver = message.receiver);
    message.amount !== undefined && (obj.amount = message.amount);
    message.gas !== undefined && (obj.gas = message.gas);
    message.block !== undefined && (obj.block = Math.round(message.block));
    message.blockHash !== undefined && (obj.blockHash = message.blockHash);
    message.note !== undefined && (obj.note = message.note);
    return obj;
  },

  create<I extends Exact<DeepPartial<ITxn>, I>>(base?: I): ITxn {
    return ITxn.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ITxn>, I>>(object: I): ITxn {
    const message = createBaseITxn();
    message.hash = object.hash ?? "";
    message.sender = object.sender ?? "";
    message.receiver = object.receiver ?? "";
    message.amount = object.amount ?? "";
    message.gas = object.gas ?? "";
    message.block = object.block ?? 0;
    message.blockHash = object.blockHash ?? "";
    message.note = object.note ?? "";
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
