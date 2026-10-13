import { useState, useEffect } from "react"
import {
  PageHead,
  Panel,
  Badge,
  Button,
  Hash,
  Notice,
  Icon,
} from "../components/common"
import { sha256 } from "@/utils/hashing"

export function CryptoLab() {
  const original = JSON.stringify({
    height: 12846,
    timestamp: "2025-06-18T10:41:49Z",
    transactions: 2,
    validator: "VAL-02",
  })
  const [data, setData] = useState(original)
  const [originalHash, setOriginalHash] = useState("")
  const [currentHash, setCurrentHash] = useState("")

  useEffect(() => {
    sha256(original).then(setOriginalHash)
  }, [])

  useEffect(() => {
    sha256(data).then(setCurrentHash)
  }, [data])

  const tampered = data !== original

  return (
    <>
      <PageHead
        title="Cryptographic Verification"
        desc="Observe how SHA-256 hash chaining makes ledger modification evident."
        actions={
          <>
            <Button
              kind={tampered ? "secondary" : "danger"}
              icon={tampered ? "refresh" : "alert"}
              onClick={() =>
                setData(
                  tampered
                    ? original
                    : JSON.stringify({
                        height: 12846,
                        timestamp: "2025-06-18T10:41:49Z",
                        transactions: 9,
                        validator: "VAL-02",
                      }),
                )
              }
            >
              {tampered ? "Restore original data" : "Tamper with block"}
            </Button>
          </>
        }
      />
      <Notice
        icon="shield"
        title="Genuine browser-side hashing"
        description="Hashes below are calculated with the Web Crypto API using SHA-256. Signature status uses a labeled demo fixture and is not a live key ceremony."
      />
      <div className="crypto-flow">
        <Panel title="Block 12,846 payload">
          <div className={`code-editor ${tampered ? "tampered" : ""}`}>
            <div className="code-head">
              <span>block.json</span>
              {tampered && <Badge tone="bad">MODIFIED</Badge>}
            </div>
            <pre>
              {data
                .replaceAll(",", ",\n  ")
                .replace("{", "{\n  ")
                .replace("}", "\n}")}
            </pre>
          </div>
        </Panel>
        <div className="flow-arrow">
          <Icon name="chevron" />
          <span>SHA-256</span>
        </div>
        <Panel title="Computed block hash">
          <div className="big-hash">
            <Hash value={currentHash || "calculating…"} full />
          </div>
          <div className="hash-compare">
            <span>Original committed hash</span>
            <code>{originalHash}</code>
            <span>Current computed hash</span>
            <code className={tampered ? "bad-text" : ""}>{currentHash}</code>
          </div>
        </Panel>
      </div>
      <Panel title="Chain verification">
        <div className="chain-verify">
          <div className={tampered ? "failed-block" : "verified-block"}>
            <small>BLOCK 12,846</small>
            <strong>
              {currentHash ? currentHash.slice(0, 16) + "…" : "pending"}
            </strong>
            <Badge tone={tampered ? "bad" : "good"}>
              {tampered ? "HASH CHANGED" : "VERIFIED"}
            </Badge>
          </div>
          <div className={`connector ${tampered ? "broken" : ""}`}>
            <span>{tampered ? "≠" : "="}</span>
            <small>hash reference</small>
          </div>
          <div className={tampered ? "failed-block" : "verified-block"}>
            <small>BLOCK 12,847 · previousHash</small>
            <strong>
              {originalHash ? originalHash.slice(0, 16) + "…" : "pending"}
            </strong>
            <Badge tone={tampered ? "bad" : "good"}>
              {tampered ? "MISMATCH" : "MATCH"}
            </Badge>
          </div>
        </div>
        <div className={`result-banner ${tampered ? "bad" : "good"}`}>
          <Icon name={tampered ? "alert" : "check"} />
          <div>
            <strong>
              {tampered
                ? "Ledger integrity violation detected"
                : "Hash chain integrity verified"}
            </strong>
            <span>
              {tampered
                ? "The modified block hash no longer matches the immutable previousHash stored by block 12,847."
                : "The computed hash matches the next block's stored reference."}
            </span>
          </div>
        </div>
      </Panel>
    </>
  )
}
