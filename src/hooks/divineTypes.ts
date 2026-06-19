// 共享的起卦结果类型，用于在 divine page 和 history 间复用
import type { HexagramDetail } from '@/data/bagua'

export interface DivineResult {
  hexName: string; changedHexName: string
  upperName: string; lowerName: string
  changedUpperName: string; changedLowerName: string
  nowDetail?: HexagramDetail; changedDetail?: HexagramDetail
  nowSymbol: string; changedSymbol: string
  movingName: string; movingChange: string
  yao6: number[]; changedYao6: number[]
  movingIndex: number
}
