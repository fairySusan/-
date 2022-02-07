import fs from 'fs'
import babelParser from '@babel/parser'
import traverse from '@babel/traverse'
import path from 'path'
import ejs from 'ejs'
import {transformFromAst} from 'babel-core'

let id = 0

function createAssets (filePath) {
  /*
  1. 获取文件的内容
  2. 获取依赖关系- AST (抽象语法树)
 */
  const source = fs.readFileSync(filePath,{
    encoding: 'utf-8'
  })

  // 将源代码转化成AST语法树
  const ast = babelParser.parse(source, {
    sourceType: 'module'
  })

  // 获取import代码的依赖路径
  const deps = []
  traverse.default(ast, {
    ImportDeclaration({node}) {
      deps.push(node.source.value)
    }
  })

  /* 将抽象语法树的import语法改为require语法，将esm代码转换为cjs的代码 */
  const {code} = transformFromAst(ast, null, {
    presets: ["env"]
  })

  return {
    code,
    filePath,
    source,
    deps,
    id: id++,
    mapping: {}
  }
}

/* 递归生成依赖图结构 */
function createGraph () {
  const mainAsset = createAssets('./example/main.js')

  const graph = [mainAsset]

  for (const asset of graph) {
    asset.deps.forEach(relativePath => {
      const child = createAssets(path.resolve('./example', relativePath))
      asset.mapping[relativePath] = child.id
      graph.push(child)
    })
  }
  return graph
}    

const graph = createGraph()

function build (graph) {
  const template = fs.readFileSync('./bundle.ejs', {
    encoding: 'utf-8'
  })
  const data = graph.map(asset => {
    return {
      id: asset.id,
      code: asset.code,
      mapping: asset.mapping,
    }
  })
  const code = ejs.render(template, {data})
  fs.writeFileSync('./dist/bundle.js', code)
}

build(graph)