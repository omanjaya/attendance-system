#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the current bundle size and provides optimization recommendations
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class BundleAnalyzer {
  constructor() {
    this.srcPath = path.join(__dirname, '../src')
    this.distPath = path.join(__dirname, '../dist')
    this.results = {
      components: {},
      composables: {},
      assets: {},
      recommendations: []
    }
  }

  async analyze() {
    console.log('🔍 Starting Bundle Analysis...\n')
    
    this.analyzeComponents()
    this.analyzeComposables()
    this.analyzeAssets()
    this.generateRecommendations()
    this.printReport()
  }

  analyzeComponents() {
    console.log('📦 Analyzing Components...')
    
    const componentDirs = [
      'components/base',
      'components/ui', 
      'components/charts',
      'components/layout',
      'pages'
    ]

    componentDirs.forEach(dir => {
      const fullPath = path.join(this.srcPath, dir)
      if (fs.existsSync(fullPath)) {
        this.analyzeDirectory(fullPath, dir)
      }
    })
  }

  analyzeDirectory(dirPath, category) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
    
    files.forEach(file => {
      if (file.isFile() && file.name.endsWith('.vue')) {
        const filePath = path.join(dirPath, file.name)
        const stats = fs.statSync(filePath)
        const content = fs.readFileSync(filePath, 'utf8')
        
        this.results.components[file.name] = {
          category,
          size: stats.size,
          lines: content.split('\n').length,
          imports: this.countImports(content),
          complexity: this.calculateComplexity(content)
        }
      } else if (file.isDirectory()) {
        this.analyzeDirectory(path.join(dirPath, file.name), `${category}/${file.name}`)
      }
    })
  }

  analyzeComposables() {
    console.log('🔧 Analyzing Composables...')
    
    const composablesPath = path.join(this.srcPath, 'composables')
    if (fs.existsSync(composablesPath)) {
      const files = fs.readdirSync(composablesPath)
      
      files.forEach(file => {
        if (file.endsWith('.js')) {
          const filePath = path.join(composablesPath, file)
          const stats = fs.statSync(filePath)
          const content = fs.readFileSync(filePath, 'utf8')
          
          this.results.composables[file] = {
            size: stats.size,
            lines: content.split('\n').length,
            exports: this.countExports(content),
            dependencies: this.extractDependencies(content)
          }
        }
      })
    }
  }

  analyzeAssets() {
    console.log('🎨 Analyzing Assets...')
    
    const assetsPath = path.join(this.srcPath, 'assets')
    if (fs.existsSync(assetsPath)) {
      this.analyzeAssetsDirectory(assetsPath)
    }
  }

  analyzeAssetsDirectory(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file.name)
      
      if (file.isFile()) {
        const stats = fs.statSync(filePath)
        const ext = path.extname(file.name)
        
        if (!this.results.assets[ext]) {
          this.results.assets[ext] = { count: 0, totalSize: 0, files: [] }
        }
        
        this.results.assets[ext].count++
        this.results.assets[ext].totalSize += stats.size
        this.results.assets[ext].files.push({
          name: file.name,
          size: stats.size
        })
      } else if (file.isDirectory()) {
        this.analyzeAssetsDirectory(filePath)
      }
    })
  }

  countImports(content) {
    const importMatches = content.match(/import.*from/g)
    return importMatches ? importMatches.length : 0
  }

  countExports(content) {
    const exportMatches = content.match(/export\s+(const|function|class|default)/g)
    return exportMatches ? exportMatches.length : 0
  }

  extractDependencies(content) {
    const deps = []
    const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g)
    
    if (importMatches) {
      importMatches.forEach(match => {
        const dep = match.match(/from\s+['"]([^'"]+)['"]/)[1]
        if (!dep.startsWith('.') && !dep.startsWith('@/')) {
          deps.push(dep)
        }
      })
    }
    
    return [...new Set(deps)]
  }

  calculateComplexity(content) {
    // Simple complexity score based on various factors
    let complexity = 0
    
    complexity += (content.match(/if\s*\(/g) || []).length
    complexity += (content.match(/for\s*\(/g) || []).length
    complexity += (content.match(/while\s*\(/g) || []).length
    complexity += (content.match(/function\s+/g) || []).length
    complexity += (content.match(/=>\s*/g) || []).length
    
    return complexity
  }

  generateRecommendations() {
    console.log('💡 Generating Recommendations...')
    
    // Large components
    const largeComponents = Object.entries(this.results.components)
      .filter(([_, data]) => data.size > 10000)
      .sort((a, b) => b[1].size - a[1].size)
    
    if (largeComponents.length > 0) {
      this.results.recommendations.push({
        type: 'optimization',
        priority: 'high',
        title: 'Large Components Detected',
        description: `Components larger than 10KB should be split or optimized`,
        items: largeComponents.map(([name, data]) => 
          `${name} (${(data.size / 1024).toFixed(1)}KB, ${data.lines} lines)`
        )
      })
    }

    // Complex components
    const complexComponents = Object.entries(this.results.components)
      .filter(([_, data]) => data.complexity > 20)
      .sort((a, b) => b[1].complexity - a[1].complexity)
    
    if (complexComponents.length > 0) {
      this.results.recommendations.push({
        type: 'refactoring',
        priority: 'medium',
        title: 'High Complexity Components',
        description: 'Components with high complexity should be refactored',
        items: complexComponents.map(([name, data]) => 
          `${name} (complexity: ${data.complexity})`
        )
      })
    }

    // Heavy dependencies
    const heavyComposables = Object.entries(this.results.composables)
      .filter(([_, data]) => data.dependencies.length > 5)
    
    if (heavyComposables.length > 0) {
      this.results.recommendations.push({
        type: 'dependencies',
        priority: 'medium',
        title: 'Heavy Dependencies in Composables',
        description: 'Composables with many dependencies may need splitting',
        items: heavyComposables.map(([name, data]) => 
          `${name} (${data.dependencies.length} dependencies)`
        )
      })
    }

    // Asset optimization
    const cssAssets = this.results.assets['.css']
    if (cssAssets && cssAssets.totalSize > 100000) {
      this.results.recommendations.push({
        type: 'assets',
        priority: 'high',
        title: 'Large CSS Bundle',
        description: `CSS assets total ${(cssAssets.totalSize / 1024).toFixed(1)}KB - consider purging unused styles`,
        items: cssAssets.files.map(file => 
          `${file.name} (${(file.size / 1024).toFixed(1)}KB)`
        )
      })
    }
  }

  printReport() {
    console.log('\n📊 BUNDLE ANALYSIS REPORT\n')
    console.log('=' + '='.repeat(50))
    
    // Components Summary
    console.log('\n📦 COMPONENTS SUMMARY')
    console.log('-'.repeat(30))
    
    const componentsByCategory = {}
    Object.entries(this.results.components).forEach(([name, data]) => {
      if (!componentsByCategory[data.category]) {
        componentsByCategory[data.category] = { count: 0, totalSize: 0 }
      }
      componentsByCategory[data.category].count++
      componentsByCategory[data.category].totalSize += data.size
    })
    
    Object.entries(componentsByCategory).forEach(([category, data]) => {
      console.log(`${category}: ${data.count} files, ${(data.totalSize / 1024).toFixed(1)}KB`)
    })
    
    // Composables Summary
    console.log('\n🔧 COMPOSABLES SUMMARY')
    console.log('-'.repeat(30))
    
    const composablesTotal = Object.values(this.results.composables)
      .reduce((sum, data) => sum + data.size, 0)
    
    console.log(`Total: ${Object.keys(this.results.composables).length} files, ${(composablesTotal / 1024).toFixed(1)}KB`)
    
    // Assets Summary
    console.log('\n🎨 ASSETS SUMMARY')
    console.log('-'.repeat(30))
    
    Object.entries(this.results.assets).forEach(([ext, data]) => {
      console.log(`${ext}: ${data.count} files, ${(data.totalSize / 1024).toFixed(1)}KB`)
    })
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS')
    console.log('-'.repeat(30))
    
    if (this.results.recommendations.length === 0) {
      console.log('✅ No immediate optimizations needed!')
    } else {
      this.results.recommendations.forEach((rec, index) => {
        console.log(`\n${index + 1}. ${rec.title} (${rec.priority} priority)`)
        console.log(`   ${rec.description}`)
        if (rec.items && rec.items.length > 0) {
          rec.items.slice(0, 3).forEach(item => {
            console.log(`   • ${item}`)
          })
          if (rec.items.length > 3) {
            console.log(`   • ... and ${rec.items.length - 3} more`)
          }
        }
      })
    }
    
    console.log('\n' + '='.repeat(52))
    console.log('Analysis complete! 🎉')
  }
}

// Run analysis
if (require.main === module) {
  const analyzer = new BundleAnalyzer()
  analyzer.analyze().catch(console.error)
}

module.exports = BundleAnalyzer