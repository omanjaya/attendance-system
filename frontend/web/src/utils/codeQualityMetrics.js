/**
 * Code Quality Metrics Tracking System
 * Measures and tracks code quality improvements
 */

class CodeQualityMetrics {
  constructor() {
    this.metrics = {
      cyclomaticComplexity: new Map(),
      duplicateCode: new Map(),
      testCoverage: new Map(),
      maintainabilityIndex: new Map(),
      technicalDebt: new Map(),
      codeSmells: new Map(),
      dependencies: new Map(),
      performance: new Map()
    }
    
    this.thresholds = {
      cyclomaticComplexity: {
        low: 10,
        moderate: 20,
        high: 30
      },
      duplicateCode: {
        acceptable: 5, // percentage
        warning: 10,
        critical: 20
      },
      testCoverage: {
        minimum: 70,
        good: 80,
        excellent: 90
      },
      maintainabilityIndex: {
        poor: 10,
        fair: 20,
        good: 70,
        excellent: 85
      },
      technicalDebt: {
        low: 5, // hours
        moderate: 20,
        high: 50
      }
    }

    this.init()
  }

  init() {
    this.loadStoredMetrics()
    this.setupPeriodicCollection()
  }

  // Cyclomatic Complexity Analysis
  calculateCyclomaticComplexity(code) {
    const complexityKeywords = [
      'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      'catch', 'finally', '&&', '||', '?', 'throw'
    ]

    let complexity = 1 // Base complexity

    complexityKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      const matches = code.match(regex)
      if (matches) {
        complexity += matches.length
      }
    })

    return complexity
  }

  analyzeFileComplexity(filePath, code) {
    const complexity = this.calculateCyclomaticComplexity(code)
    const functions = this.extractFunctions(code)
    
    const fileMetrics = {
      filePath,
      totalComplexity: complexity,
      avgComplexity: functions.length > 0 ? complexity / functions.length : complexity,
      functions: functions.map(func => ({
        name: func.name,
        complexity: this.calculateCyclomaticComplexity(func.code),
        lines: func.code.split('\n').length
      })),
      timestamp: Date.now(),
      rating: this.rateComplexity(complexity)
    }

    this.recordMetric('cyclomaticComplexity', filePath, fileMetrics)
    return fileMetrics
  }

  extractFunctions(code) {
    const functionRegex = /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?\(|(\w+)\s*:\s*(?:async\s+)?function|\w+\s*\(\s*\)\s*=>)/g
    const functions = []
    let match

    while ((match = functionRegex.exec(code)) !== null) {
      const funcName = match[1] || match[2] || match[3] || 'anonymous'
      
      // Extract function body (simplified)
      let start = match.index
      let braceCount = 0
      let inFunction = false
      let funcCode = ''

      for (let i = start; i < code.length; i++) {
        const char = code[i]
        funcCode += char

        if (char === '{') {
          braceCount++
          inFunction = true
        } else if (char === '}') {
          braceCount--
          if (inFunction && braceCount === 0) {
            break
          }
        }
      }

      functions.push({
        name: funcName,
        code: funcCode,
        startIndex: start
      })
    }

    return functions
  }

  rateComplexity(complexity) {
    if (complexity <= this.thresholds.cyclomaticComplexity.low) return 'low'
    if (complexity <= this.thresholds.cyclomaticComplexity.moderate) return 'moderate'
    if (complexity <= this.thresholds.cyclomaticComplexity.high) return 'high'
    return 'very-high'
  }

  // Duplicate Code Detection
  detectDuplicateCode(files) {
    const duplicates = []
    const codeBlocks = new Map()

    // Extract code blocks (simplified)
    files.forEach(file => {
      const blocks = this.extractCodeBlocks(file.content)
      blocks.forEach(block => {
        const hash = this.hashCode(block.code)
        if (!codeBlocks.has(hash)) {
          codeBlocks.set(hash, [])
        }
        codeBlocks.get(hash).push({
          file: file.path,
          block: block,
          code: block.code
        })
      })
    })

    // Find duplicates
    codeBlocks.forEach((instances, hash) => {
      if (instances.length > 1 && instances[0].code.trim().length > 50) {
        duplicates.push({
          hash,
          instances,
          duplicateCount: instances.length,
          codeLength: instances[0].code.length,
          severity: this.rateDuplicateCode(instances.length, instances[0].code.length)
        })
      }
    })

    const metrics = {
      totalFiles: files.length,
      duplicateBlocks: duplicates.length,
      duplicatePercentage: duplicates.length > 0 ? (duplicates.reduce((sum, dup) => sum + dup.duplicateCount, 0) / files.length) * 100 : 0,
      duplicates,
      timestamp: Date.now()
    }

    this.recordMetric('duplicateCode', 'project', metrics)
    return metrics
  }

  extractCodeBlocks(code) {
    const lines = code.split('\n')
    const blocks = []
    let currentBlock = []

    lines.forEach((line, index) => {
      if (line.trim().length > 0 && !line.trim().startsWith('//') && !line.trim().startsWith('/*')) {
        currentBlock.push(line)
      } else {
        if (currentBlock.length >= 5) { // Minimum 5 lines to consider
          blocks.push({
            startLine: index - currentBlock.length + 1,
            endLine: index,
            code: currentBlock.join('\n')
          })
        }
        currentBlock = []
      }
    })

    return blocks
  }

  hashCode(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }

  rateDuplicateCode(instanceCount, codeLength) {
    const impact = instanceCount * codeLength
    if (impact > 1000) return 'high'
    if (impact > 500) return 'medium'
    return 'low'
  }

  // Test Coverage Analysis
  analyzeTestCoverage(coverageData) {
    const metrics = {
      statements: {
        total: coverageData.total.statements,
        covered: coverageData.total.covered,
        percentage: (coverageData.total.covered / coverageData.total.statements) * 100
      },
      branches: {
        total: coverageData.total.branches,
        covered: coverageData.total.branchesCovered,
        percentage: (coverageData.total.branchesCovered / coverageData.total.branches) * 100
      },
      functions: {
        total: coverageData.total.functions,
        covered: coverageData.total.functionsCovered,
        percentage: (coverageData.total.functionsCovered / coverageData.total.functions) * 100
      },
      lines: {
        total: coverageData.total.lines,
        covered: coverageData.total.linesCovered,
        percentage: (coverageData.total.linesCovered / coverageData.total.lines) * 100
      },
      files: this.analyzeFileCoverage(coverageData.files),
      timestamp: Date.now(),
      rating: this.rateCoverage(coverageData)
    }

    this.recordMetric('testCoverage', 'project', metrics)
    return metrics
  }

  analyzeFileCoverage(files) {
    return Object.entries(files).map(([filePath, fileData]) => ({
      path: filePath,
      statements: (fileData.s ? Object.values(fileData.s).filter(v => v > 0).length / Object.keys(fileData.s).length : 0) * 100,
      branches: (fileData.b ? Object.values(fileData.b).flat().filter(v => v > 0).length / Object.values(fileData.b).flat().length : 0) * 100,
      functions: (fileData.f ? Object.values(fileData.f).filter(v => v > 0).length / Object.keys(fileData.f).length : 0) * 100,
      lines: (fileData.l ? Object.values(fileData.l).filter(v => v > 0).length / Object.keys(fileData.l).length : 0) * 100
    })).sort((a, b) => a.statements - b.statements)
  }

  rateCoverage(coverageData) {
    const avgCoverage = (
      (coverageData.total.covered / coverageData.total.statements) +
      (coverageData.total.branchesCovered / coverageData.total.branches) +
      (coverageData.total.functionsCovered / coverageData.total.functions) +
      (coverageData.total.linesCovered / coverageData.total.lines)
    ) / 4 * 100

    if (avgCoverage >= this.thresholds.testCoverage.excellent) return 'excellent'
    if (avgCoverage >= this.thresholds.testCoverage.good) return 'good'
    if (avgCoverage >= this.thresholds.testCoverage.minimum) return 'acceptable'
    return 'poor'
  }

  // Maintainability Index Calculation
  calculateMaintainabilityIndex(filePath, code) {
    const halsteadMetrics = this.calculateHalsteadMetrics(code)
    const cyclomaticComplexity = this.calculateCyclomaticComplexity(code)
    const linesOfCode = code.split('\n').filter(line => line.trim().length > 0).length
    const commentLines = this.countCommentLines(code)

    // Simplified maintainability index calculation
    const maintainabilityIndex = Math.max(0, 
      (171 - 5.2 * Math.log(halsteadMetrics.volume) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(linesOfCode)) * 100 / 171
    )

    const metrics = {
      filePath,
      maintainabilityIndex,
      halsteadVolume: halsteadMetrics.volume,
      cyclomaticComplexity,
      linesOfCode,
      commentLines,
      commentRatio: commentLines / linesOfCode,
      rating: this.rateMaintainability(maintainabilityIndex),
      timestamp: Date.now()
    }

    this.recordMetric('maintainabilityIndex', filePath, metrics)
    return metrics
  }

  calculateHalsteadMetrics(code) {
    const operators = ['+', '-', '*', '/', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '&&', '||', '!', '?', ':', ';', ',', '.', '[', ']', '{', '}', '(', ')']
    const operands = code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || []
    
    const uniqueOperators = new Set()
    const uniqueOperands = new Set(operands)
    
    operators.forEach(op => {
      if (code.includes(op)) {
        uniqueOperators.add(op)
      }
    })

    const n1 = uniqueOperators.size // Number of distinct operators
    const n2 = uniqueOperands.size // Number of distinct operands
    const N1 = operators.reduce((count, op) => count + (code.match(new RegExp(`\\${op}`, 'g')) || []).length, 0) // Total operators
    const N2 = operands.length // Total operands

    const vocabulary = n1 + n2
    const length = N1 + N2
    const volume = length * Math.log2(vocabulary || 1)
    const difficulty = (n1 / 2) * (N2 / (n2 || 1))
    const effort = difficulty * volume

    return { vocabulary, length, volume, difficulty, effort }
  }

  countCommentLines(code) {
    const commentPattern = /\/\*[\s\S]*?\*\/|\/\/.*$/gm
    const comments = code.match(commentPattern) || []
    return comments.reduce((count, comment) => count + comment.split('\n').length, 0)
  }

  rateMaintainability(index) {
    if (index >= this.thresholds.maintainabilityIndex.excellent) return 'excellent'
    if (index >= this.thresholds.maintainabilityIndex.good) return 'good'
    if (index >= this.thresholds.maintainabilityIndex.fair) return 'fair'
    return 'poor'
  }

  // Technical Debt Assessment
  assessTechnicalDebt(files, issues) {
    const debtItems = []

    // Analyze code smells
    files.forEach(file => {
      const smells = this.detectCodeSmells(file.content, file.path)
      debtItems.push(...smells)
    })

    // Include linting issues
    if (issues && issues.length > 0) {
      issues.forEach(issue => {
        debtItems.push({
          type: 'lint',
          severity: issue.severity || 'warning',
          message: issue.message,
          file: issue.filePath,
          line: issue.line,
          estimatedEffort: this.estimateFixEffort(issue)
        })
      })
    }

    const totalEffort = debtItems.reduce((sum, item) => sum + item.estimatedEffort, 0)
    const debtByType = this.groupBy(debtItems, 'type')
    const debtBySeverity = this.groupBy(debtItems, 'severity')

    const metrics = {
      totalItems: debtItems.length,
      totalEffortHours: totalEffort,
      rating: this.rateTechnicalDebt(totalEffort),
      breakdown: {
        byType: Object.entries(debtByType).map(([type, items]) => ({
          type,
          count: items.length,
          effort: items.reduce((sum, item) => sum + item.estimatedEffort, 0)
        })),
        bySeverity: Object.entries(debtBySeverity).map(([severity, items]) => ({
          severity,
          count: items.length,
          effort: items.reduce((sum, item) => sum + item.estimatedEffort, 0)
        }))
      },
      items: debtItems,
      timestamp: Date.now()
    }

    this.recordMetric('technicalDebt', 'project', metrics)
    return metrics
  }

  detectCodeSmells(code, filePath) {
    const smells = []

    // Long methods
    const functions = this.extractFunctions(code)
    functions.forEach(func => {
      const lines = func.code.split('\n').length
      if (lines > 50) {
        smells.push({
          type: 'long-method',
          severity: lines > 100 ? 'error' : 'warning',
          message: `Method '${func.name}' is too long (${lines} lines)`,
          file: filePath,
          estimatedEffort: Math.ceil(lines / 20) // 20 lines per hour to refactor
        })
      }
    })

    // Large files
    const fileLines = code.split('\n').length
    if (fileLines > 500) {
      smells.push({
        type: 'large-file',
        severity: fileLines > 1000 ? 'error' : 'warning',
        message: `File is too large (${fileLines} lines)`,
        file: filePath,
        estimatedEffort: Math.ceil(fileLines / 100) // 100 lines per hour to refactor
      })
    }

    // Deep nesting
    const maxNesting = this.calculateMaxNesting(code)
    if (maxNesting > 4) {
      smells.push({
        type: 'deep-nesting',
        severity: maxNesting > 6 ? 'error' : 'warning',
        message: `Deep nesting detected (${maxNesting} levels)`,
        file: filePath,
        estimatedEffort: maxNesting - 3 // 1 hour per excessive level
      })
    }

    // TODO/FIXME comments
    const todoPattern = /\/\/\s*(TODO|FIXME|HACK|XXX).*$/gmi
    const todos = code.match(todoPattern) || []
    todos.forEach(todo => {
      smells.push({
        type: 'todo-comment',
        severity: 'info',
        message: todo.trim(),
        file: filePath,
        estimatedEffort: 0.5 // 30 minutes per TODO
      })
    })

    return smells
  }

  calculateMaxNesting(code) {
    const lines = code.split('\n')
    let maxNesting = 0
    let currentNesting = 0

    lines.forEach(line => {
      const trimmed = line.trim()
      
      // Count opening braces/keywords that increase nesting
      const opens = (trimmed.match(/\{|if\s*\(|for\s*\(|while\s*\(|switch\s*\(/g) || []).length
      const closes = (trimmed.match(/\}/g) || []).length
      
      currentNesting += opens - closes
      maxNesting = Math.max(maxNesting, currentNesting)
    })

    return maxNesting
  }

  estimateFixEffort(issue) {
    const effortMap = {
      'error': 1.0,
      'warning': 0.5,
      'info': 0.25
    }
    return effortMap[issue.severity] || 0.5
  }

  rateTechnicalDebt(effortHours) {
    if (effortHours <= this.thresholds.technicalDebt.low) return 'low'
    if (effortHours <= this.thresholds.technicalDebt.moderate) return 'moderate'
    if (effortHours <= this.thresholds.technicalDebt.high) return 'high'
    return 'critical'
  }

  // Dependency Analysis
  analyzeDependencies(packageJson, lockfile) {
    const dependencies = packageJson.dependencies || {}
    const devDependencies = packageJson.devDependencies || {}
    const allDeps = { ...dependencies, ...devDependencies }

    const metrics = {
      totalDependencies: Object.keys(allDeps).length,
      productionDependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      outdatedPackages: this.findOutdatedPackages(allDeps),
      vulnerabilities: this.analyzeVulnerabilities(allDeps),
      duplicates: this.findDuplicateDependencies(lockfile),
      bundleImpact: this.analyzeBundleImpact(dependencies),
      timestamp: Date.now()
    }

    this.recordMetric('dependencies', 'project', metrics)
    return metrics
  }

  findOutdatedPackages(dependencies) {
    // This would typically involve checking against npm registry
    // For now, return a placeholder
    return []
  }

  analyzeVulnerabilities(dependencies) {
    // This would typically involve security audit
    // For now, return a placeholder
    return {
      total: 0,
      high: 0,
      moderate: 0,
      low: 0
    }
  }

  findDuplicateDependencies(lockfile) {
    // Analyze package-lock.json for duplicate packages
    // For now, return a placeholder
    return []
  }

  analyzeBundleImpact(dependencies) {
    // Estimate bundle size impact of dependencies
    // For now, return a placeholder
    return {
      estimatedSize: 0,
      heavyDependencies: []
    }
  }

  // Utility methods
  recordMetric(category, identifier, data) {
    if (!this.metrics[category]) {
      this.metrics[category] = new Map()
    }
    
    this.metrics[category].set(identifier, {
      ...data,
      id: this.generateId(),
      timestamp: Date.now()
    })

    this.saveMetrics()
  }

  getMetric(category, identifier) {
    return this.metrics[category]?.get(identifier)
  }

  getMetrics(category) {
    return category ? this.metrics[category] : this.metrics
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9)
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key] || 'unknown'
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {})
  }

  // Persistence
  saveMetrics() {
    try {
      const serializable = {}
      Object.entries(this.metrics).forEach(([category, map]) => {
        serializable[category] = Object.fromEntries(map)
      })
      
      localStorage.setItem('code_quality_metrics', JSON.stringify(serializable))
    } catch (e) {
      console.warn('Failed to save code quality metrics:', e)
    }
  }

  loadStoredMetrics() {
    try {
      const stored = localStorage.getItem('code_quality_metrics')
      if (stored) {
        const data = JSON.parse(stored)
        Object.entries(data).forEach(([category, metrics]) => {
          this.metrics[category] = new Map(Object.entries(metrics))
        })
      }
    } catch (e) {
      console.warn('Failed to load stored code quality metrics:', e)
    }
  }

  setupPeriodicCollection() {
    // Run quality analysis periodically in development
    if (process.env.NODE_ENV === 'development') {
      setInterval(() => {
        this.generateQualityReport()
      }, 300000) // Every 5 minutes
    }
  }

  // Generate comprehensive quality report
  generateQualityReport() {
    const report = {
      timestamp: Date.now(),
      overview: this.getQualityOverview(),
      complexity: this.getComplexitySummary(),
      coverage: this.getCoverageSummary(),
      debt: this.getDebtSummary(),
      trends: this.getTrends(),
      recommendations: this.getRecommendations()
    }

    console.log('Code Quality Report:', report)
    return report
  }

  getQualityOverview() {
    const categories = Object.keys(this.metrics)
    const scores = {}

    categories.forEach(category => {
      const metrics = Array.from(this.metrics[category].values())
      if (metrics.length > 0) {
        scores[category] = this.calculateCategoryScore(category, metrics)
      }
    })

    return {
      overallScore: Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length,
      categoryScores: scores,
      lastUpdated: Date.now()
    }
  }

  calculateCategoryScore(category, metrics) {
    // Simplified scoring based on ratings
    const ratingScores = { excellent: 100, good: 80, fair: 60, acceptable: 50, moderate: 40, poor: 20, low: 80, high: 20 }
    
    const scores = metrics.map(metric => ratingScores[metric.rating] || 50)
    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }

  getComplexitySummary() {
    const complexityMetrics = Array.from(this.metrics.cyclomaticComplexity?.values() || [])
    if (complexityMetrics.length === 0) return null

    return {
      avgComplexity: complexityMetrics.reduce((sum, m) => sum + m.avgComplexity, 0) / complexityMetrics.length,
      highComplexityFiles: complexityMetrics.filter(m => m.rating === 'high' || m.rating === 'very-high').length,
      totalFiles: complexityMetrics.length
    }
  }

  getCoverageSummary() {
    const coverageMetric = this.getMetric('testCoverage', 'project')
    return coverageMetric || null
  }

  getDebtSummary() {
    const debtMetric = this.getMetric('technicalDebt', 'project')
    return debtMetric || null
  }

  getTrends() {
    // Calculate trends over time (simplified)
    return {
      complexity: 'stable',
      coverage: 'improving',
      debt: 'decreasing'
    }
  }

  getRecommendations() {
    const recommendations = []
    
    const complexity = this.getComplexitySummary()
    if (complexity && complexity.highComplexityFiles > 0) {
      recommendations.push({
        type: 'complexity',
        priority: 'high',
        message: `${complexity.highComplexityFiles} files have high complexity. Consider refactoring.`
      })
    }

    const coverage = this.getCoverageSummary()
    if (coverage && coverage.statements.percentage < this.thresholds.testCoverage.minimum) {
      recommendations.push({
        type: 'coverage',
        priority: 'high',
        message: `Test coverage is ${coverage.statements.percentage.toFixed(1)}%. Aim for at least ${this.thresholds.testCoverage.minimum}%.`
      })
    }

    const debt = this.getDebtSummary()
    if (debt && debt.rating === 'high' || debt?.rating === 'critical') {
      recommendations.push({
        type: 'debt',
        priority: 'high',
        message: `Technical debt is ${debt.rating}. Consider addressing ${debt.totalItems} issues.`
      })
    }

    return recommendations
  }

  // Export functionality
  exportMetrics() {
    return {
      timestamp: Date.now(),
      metrics: Object.fromEntries(
        Object.entries(this.metrics).map(([category, map]) => 
          [category, Object.fromEntries(map)]
        )
      ),
      thresholds: this.thresholds,
      report: this.generateQualityReport()
    }
  }

  clearMetrics(category) {
    if (category) {
      this.metrics[category].clear()
    } else {
      Object.values(this.metrics).forEach(map => map.clear())
    }
    this.saveMetrics()
  }
}

// Create singleton instance
const codeQualityMetrics = new CodeQualityMetrics()

export { codeQualityMetrics, CodeQualityMetrics }
export default codeQualityMetrics