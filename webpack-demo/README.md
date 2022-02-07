### webpack-demo实现的几个要点：
1. 获取文件内容：node 的 fs 模块
2. 获取依赖关系，构建依赖图：@babel/parser 将源代码解析为AST，使用 @babel/traverse 遍历 AST 树，获取 import from 代码，
   获取路径，同时将源代码转化为cjs代码，也就是将import 转为 reqiure
3. 创建ejs模板
