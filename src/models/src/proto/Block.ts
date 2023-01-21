/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "ethereum";

export interface IBlock {
  number: number;
  hash: string;
  createdAt: number;
  miner: string;
  gasUsed: number;
  gasLimit: number;
  data: string;
  txns: string[];
}

function createBaseIBlock(): IBlock {
  return { number: 0, hash: "", createdAt: 0, miner: "", gasUsed: 0, gasLimit: 0, data: "", txns: [] };
}

export const IBlock = {
  encode(message: IBlock, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.number !== 0) {
      writer.uint32(8).uint64(message.number);
    }
    if (message.hash !== "") {
      writer.uint32(18).string(message.hash);
    }
    if (message.createdAt !== 0) {
      writer.uint32(24).uint32(message.createdAt);
    }
    if (message.miner !== "") {
      writer.uint32(34).string(message.miner);
    }
    if (message.gasUsed !== 0) {
      writer.uint32(40).uint64(message.gasUsed);
    }
    if (message.gasLimit !== 0) {
      writer.uint32(48).uint64(message.gasLimit);
    }
    if (message.data !== "") {
      writer.uint32(58).string(message.data);
    }
    for (const v of message.txns) {
      writer.uint32(66).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IBlock {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIBlock();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.number = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.hash = reader.string();
          break;
        case 3:
          message.createdAt = reader.uint32();
          break;
        case 4:
          message.miner = reader.string();
          break;
        case 5:
          message.gasUsed = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.gasLimit = longToNumber(reader.uint64() as Long);
          break;
        case 7:
          message.data = reader.string();
          break;
        case 8:
          message.txns.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IBlock {
    return {
      number: isSet(object.number) ? Number(object.number) : 0,
      hash: isSet(object.hash) ? String(object.hash) : "",
      createdAt: isSet(object.createdAt) ? Number(object.createdAt) : 0,
      miner: isSet(object.miner) ? String(object.miner) : "",
      gasUsed: isSet(object.gasUsed) ? Number(object.gasUsed) : 0,
      gasLimit: isSet(object.gasLimit) ? Number(object.gasLimit) : 0,
      data: isSet(object.data) ? String(object.data) : "",
      txns: Array.isArray(object?.txns) ? object.txns.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: IBlock): unknown {
    const obj: any = {};
    message.number !== undefined && (obj.number = Math.round(message.number));
    message.hash !== undefined && (obj.hash = message.hash);
    message.createdAt !== undefined && (obj.createdAt = Math.round(message.createdAt));
    message.miner !== undefined && (obj.miner = message.miner);
    message.gasUsed !== undefined && (obj.gasUsed = Math.round(message.gasUsed));
    message.gasLimit !== undefined && (obj.gasLimit = Math.round(message.gasLimit));
    message.data !== undefined && (obj.data = message.data);
    if (message.txns) {
      obj.txns = message.txns.map((e) => e);
    } else {
      obj.txns = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IBlock>, I>>(base?: I): IBlock {
    return IBlock.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<IBlock>, I>>(object: I): IBlock {
    const message = createBaseIBlock();
    message.number = object.number ?? 0;
    message.hash = object.hash ?? "";
    message.createdAt = object.createdAt ?? 0;
    message.miner = object.miner ?? "";
    message.gasUsed = object.gasUsed ?? 0;
    message.gasLimit = object.gasLimit ?? 0;
    message.data = object.data ?? "";
    message.txns = object.txns?.map((e) => e) || [];
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
