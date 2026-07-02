import nextConfig from 'eslint-config-next'

const config = [
  ...nextConfig,
  {
    rules: {
      // 中文文本中使用 " 是标准做法，不需要转义
      'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
      // 项目中有大量从 localStorage 等外部系统同步状态的 useEffect，
      // 这些都是合理用例。降级为 warning，不作为 error 阻断。
      'react-hooks/set-state-in-effect': 'warn',
      // React Compiler 的优化提示，不影响正确性
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
]

export default config
