import Card from './ui/Card'

export default function OpsCostEstimator({
  l2Gas,
  calldataBytes
}: {
  l2Gas: number
  calldataBytes: number
}) {
  const ETH_USD = 4287.48
  const L2_GWEI = 0.01
  const L1_GWEI = 0.16
  const L1_GAS_PER_BYTE = 16
  
  const l1Gas = calldataBytes * L1_GAS_PER_BYTE
  const l2Eth = l2Gas * L2_GWEI * 1e-9
  const l1Eth = l1Gas * L1_GWEI * 1e-9
  const totalEth = l2Eth + l1Eth
  const usd = totalEth * ETH_USD

  return (
    <Card embedded>
      <div className='flex flex-col gap-2 text-sm'>
        <div>
          <span className='text-muted'>Estimated cost (preview):</span>{' '}
          <span className='font-semibold'>${usd.toFixed(4)}</span>{' '}
          <span className='text-muted'>per operation</span>
        </div>
        <div className='text-muted'>
          Inputs: L2 gas {l2Gas.toLocaleString()} @ {L2_GWEI} gwei; L1 calldata {calldataBytes} bytes × {L1_GAS_PER_BYTE} gas/byte @ {L1_GWEI} gwei; ETH/USD {ETH_USD}.
        </div>
      </div>
    </Card>
  )
}