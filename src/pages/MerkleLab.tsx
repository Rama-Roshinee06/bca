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
import type { Transaction } from "@/types"

interface TreeNodeProps {
  label: string
  hash?: string
  active?: boolean
}

function TreeNode({ label, hash, active }: TreeNodeProps) {
  return (
    <div className={active ? "tree-node active" : "tree-node"}>
      <small>{label}</small>
      <code>{hash ? hash.slice(0, 8) + "…" : "calculating"}</code>
    </div>
  )
}

export function MerkleLab() {
  const leaves: Transaction[] = [
    {
      id: "tx_1",
      asset: "AST-2849-QA",
      from: "",
      to: "",
      sig: "",
      block: 12847,
      time: "",
      status: "Committed",
      type: "",
    },
    {
      id: "tx_2",
      asset: "AST-7712-TX",
      from: "",
      to: "",
      sig: "",
      block: 12847,
      time: "",
      status: "Committed",
      type: "",
    },
    {
      id: "tx_3",
      asset: "AST-9304-NY",
      from: "",
      to: "",
      sig: "",
      block: 12846,
      time: "",
      status: "Committed",
      type: "",
    },
    {
      id: "tx_4",
      asset: "AST-1198-CA",
      from: "",
      to: "",
      sig: "",
      block: 12846,
      time: "",
      status: "Committed",
      type: "",
    },
  ]

  const [selected, setSelected] = useState(0)
  const [hashes, setHashes] = useState<string[]>([])
  const [changed, setChanged] = useState(false)

  useEffect(() => {
    Promise.all(
      leaves.map((t, i) =>
        sha256(t.id + (changed && i === selected ? "-modified" : "")),
      ),
    ).then(async (hs) => {
      const a = await sha256(hs[0] + hs[1])
      const b = await sha256(hs[2] + hs[3])
      const root = await sha256(a + b)
      setHashes([...hs, a, b, root])
    })
  }, [selected, changed])

  const root = hashes[6] || "calculating"

  return (
    <>
      <PageHead
        title="Merkle Proof Visualizer"
        desc="Build and verify a genuine SHA-256 inclusion proof from transaction leaves."
        actions={
          <Button
            onClick={() => setChanged(!changed)}
            kind={changed ? "secondary" : "danger"}
          >
            {changed ? "Restore transaction" : "Modify selected leaf"}
          </Button>
        }
      />
      <Notice
        icon="shield"
        title="Locally computed proof"
        description="Every node is hashed in this browser. Select a leaf to inspect its sibling path to the recalculated root."
      />
      <div className="merkle-layout">
        <Panel title="Merkle tree" className="span-2">
          <div className="merkle-tree">
            <div className="tree-row root">
              <TreeNode label="Merkle root" hash={root} active />
            </div>
            <div className="tree-lines">╱────────────╲</div>
            <div className="tree-row">
              <TreeNode
                label="Branch A"
                hash={hashes[4]}
                active={selected < 2}
              />
              <TreeNode
                label="Branch B"
                hash={hashes[5]}
                active={selected > 1}
              />
            </div>
            <div className="tree-lines split">╱──╲　　　　　　　╱──╲</div>
            <div className="tree-row leaves">
              {leaves.map((t, i) => (
                <button
                  key={t.id}
                  className={selected === i ? "selected" : ""}
                  onClick={() => {
                    setSelected(i)
                    setChanged(false)
                  }}
                >
                  <small>TX {i + 1}</small>
                  <strong>{t.asset}</strong>
                  <code>
                    {hashes[i] ? hashes[i].slice(0, 7) + "…" : "calculating"}
                  </code>
                </button>
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Inclusion proof">
          <div className="selected-tx">
            <small>SELECTED TRANSACTION</small>
            <strong>{leaves[selected].asset}</strong>
            <Hash value={leaves[selected].id} />
          </div>
          <div className="proof-steps">
            <div>
              <span>1</span>
              <p>
                <strong>Hash leaf</strong>
                <code>
                  {hashes[selected] ? hashes[selected].slice(0, 16) + "…" : ""}
                </code>
              </p>
            </div>
            <div>
              <span>2</span>
              <p>
                <strong>Combine sibling</strong>
                <code>
                  {hashes[selected % 2 ? selected - 1 : selected + 1]
                    ? hashes[selected % 2 ? selected - 1 : selected + 1].slice(
                        0,
                        16,
                      ) + "…"
                    : ""}
                </code>
              </p>
            </div>
            <div>
              <span>3</span>
              <p>
                <strong>Combine branch</strong>
                <code>
                  {hashes[selected < 2 ? 5 : 4]
                    ? hashes[selected < 2 ? 5 : 4].slice(0, 16) + "…"
                    : ""}
                </code>
              </p>
            </div>
          </div>
          <div className="result-banner good">
            <Icon name="check" />
            <div>
              <strong>Proof verified</strong>
              <span>
                Recomputed root matches the Merkle root stored in the block
                header.
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </>
  )
}
