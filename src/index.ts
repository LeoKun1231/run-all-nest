import path from 'node:path'
import fs from 'node:fs'
import { type ExtensionContext, commands, window, workspace } from 'vscode'

export function activate(context: ExtensionContext) {
  window.showInformationMessage('开始启动nest项目')
  const runAllNestDev = commands.registerCommand(
    'run-all-nest-dev.runAllNestDev',
    async () => {
      // 获取当前工作目录
      const rootPath = workspace.rootPath
      // 判断是否存在nest-cli.json
      const nestCliPath = path.join(rootPath!, 'nest-cli.json')
      if (!fs.existsSync(nestCliPath)) {
        window.showErrorMessage('当前目录不存在nest-cli.json')
        return
      }

      // 读取nest-cli.json
      const nestCliJson = fs.readFileSync(nestCliPath, 'utf-8')
      // 解析nest-cli.json
      const nestCli = JSON.parse(nestCliJson)

      if (nestCli?.projects) {
        window.terminals.forEach((terminal) => {
          terminal.dispose()
        })
      }

      for (const key in nestCli?.projects) {
        if (nestCli.projects[key].type === 'application') {
          // 获取项目名称
          const projectName = key
          const terminal = window.createTerminal(projectName)
          // 执行命令
          terminal.sendText(`pnpm start:dev ${key}`)
          terminal.show()
        }
      }
      window.showInformationMessage('启动nest项目 成功')
    },
  )

  context.subscriptions.push(runAllNestDev)
}

export function deactivate() {

}
