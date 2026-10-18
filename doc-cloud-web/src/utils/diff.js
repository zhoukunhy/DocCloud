/**
 * 简易行级文本对比工具（版本对比用）
 * 基于 LCS（最长公共子序列）算法，返回逐行差异序列
 */

/**
 * 对比两段文本，返回差异行列表
 * @param {String} oldText 旧版本文本
 * @param {String} newText 新版本文本
 * @returns {Array<{type: 'same'|'add'|'del', text: String}>} type: same-相同 add-新增 del-删除
 */
export function diffLines(oldText = '', newText = '') {
  const oldArr = String(oldText).split('\n')
  const newArr = String(newText).split('\n')
  const m = oldArr.length
  const n = newArr.length

  // 构建 LCS 长度表（从后向前递推）
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] =
        oldArr[i] === newArr[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  // 回溯生成差异序列
  const result = []
  let i = 0
  let j = 0
  while (i < m && j < n) {
    if (oldArr[i] === newArr[j]) {
      result.push({ type: 'same', text: oldArr[i] })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({ type: 'del', text: oldArr[i] })
      i++
    } else {
      result.push({ type: 'add', text: newArr[j] })
      j++
    }
  }
  while (i < m) result.push({ type: 'del', text: oldArr[i++] })
  while (j < n) result.push({ type: 'add', text: newArr[j++] })
  return result
}

/** 统计差异：{ added, deleted } 新增/删除行数 */
export function diffStat(lines) {
  return lines.reduce(
    (stat, line) => {
      if (line.type === 'add') stat.added++
      if (line.type === 'del') stat.deleted++
      return stat
    },
    { added: 0, deleted: 0 }
  )
}
