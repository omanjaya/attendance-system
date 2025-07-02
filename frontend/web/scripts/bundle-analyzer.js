#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 * Analyzes bundle size and provides optimization recommendations
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

class BundleAnalyzer {
  constructor(options = {}) {
    this.options = {
      distPath: path.join(__dirname, '..', 'dist'),
      outputPath: path.join(__dirname, '..', 'bundle-analysis.json'),
      thresholds: {
        totalSize: 2 * 1024 * 1024, // 2MB
        chunkSize: 500 * 1024, // 500KB
        assetSize: 100 * 1024 // 100KB
      },
      ...options
    }

    this.analysis = {
      timestamp: Date.now(),
      totalSize: 0,
      gzippedSize: 0,
      chunks: [],
      assets: [],
      recommendations: [],
      comparison: null
    }
  }

  async analyze() {
    console.log('🔍 Analyzing bundle size...')

    try {
      await this.analyzeBundleFiles()
      await this.analyzeChunks()
      await this.analyzeAssets()
      await this.generateRecommendations()
      await this.compareWithPrevious()
      await this.saveAnalysis()

      this.printReport()
      return this.analysis
    } catch (error) {
      console.error('❌ Bundle analysis failed:', error)
      throw error
    }
  }

  async analyzeBundleFiles() {
    if (!fs.existsSync(this.options.distPath)) {
      throw new Error(`Distribution directory not found: ${this.options.distPath}`)
    }

    const files = this.getAllFiles(this.options.distPath)

    for (const file of files) {
      const stats = fs.statSync(file)
      const relativePath = path.relative(this.options.distPath, file)
      const ext = path.extname(file)

      const fileInfo = {
        path: relativePath,
        size: stats.size,
        type: this.getFileType(ext),
        ext,
        gzippedSize: await this.estimateGzippedSize(file)
      }

      this.analysis.totalSize += stats.size
      this.analysis.gzippedSize += fileInfo.gzippedSize

      if (this.isChunk(file)) {
        this.analysis.chunks.push(fileInfo)
      } else {
        this.analysis.assets.push(fileInfo)
      }
    }
  }

  getAllFiles(dir, files = []) {
    const entries = fs.readdirSync(dir)

    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stats = fs.statSync(fullPath)

      if (stats.isDirectory()) {
        this.getAllFiles(fullPath, files)
      } else {
        files.push(fullPath)
      }
    }

    return files
  }

  getFileType(ext) {
    const typeMap = {
      '.js': 'javascript',
      '.mjs': 'javascript',
      '.css': 'stylesheet',
      '.html': 'html',
      '.json': 'json',
      '.png': 'image',
      '.jpg': 'image',
      '.jpeg': 'image',
      '.gif': 'image',
      '.svg': 'image',
      '.webp': 'image',
      '.woff': 'font',
      '.woff2': 'font',
      '.ttf': 'font',
      '.eot': 'font'
    }

    return typeMap[ext] || 'other'
  }

  isChunk(filePath) {
    const fileName = path.basename(filePath)
    return (
      fileName.includes('chunk') ||
      fileName.includes('vendor') ||
      (fileName.endsWith('.js') && !fileName.includes('worker'))
    )
  }

  async estimateGzippedSize(filePath) {
    // Simple estimation - actual gzip would require zlib
    // This is an approximation based on typical compression ratios
    const stats = fs.statSync(filePath)
    const ext = path.extname(filePath)

    const compressionRatios = {
      '.js': 0.35, // JavaScript compresses well
      '.css': 0.25, // CSS compresses very well
      '.html': 0.3, // HTML compresses well
      '.json': 0.2, // JSON compresses very well
      '.svg': 0.35, // SVG compresses well
      '.png': 0.95, // PNG already compressed
      '.jpg': 0.98, // JPEG already compressed
      '.woff2': 0.95 // Fonts already compressed
    }

    const ratio = compressionRatios[ext] || 0.7
    return Math.round(stats.size * ratio)
  }

  async analyzeChunks() {
    // Sort chunks by size
    this.analysis.chunks.sort((a, b) => b.size - a.size)

    // Analyze chunk composition
    for (const chunk of this.analysis.chunks) {
      chunk.category = this.categorizeChunk(chunk.path)
      chunk.isLarge = chunk.size > this.options.thresholds.chunkSize
      chunk.optimization = this.getChunkOptimization(chunk)
    }
  }

  categorizeChunk(chunkPath) {
    if (chunkPath.includes('vendor')) return 'vendor'
    if (chunkPath.includes('runtime')) return 'runtime'
    if (chunkPath.includes('async')) return 'async'
    if (chunkPath.includes('common')) return 'common'
    return 'app'
  }

  getChunkOptimization(chunk) {
    const suggestions = []

    if (chunk.size > this.options.thresholds.chunkSize) {
      suggestions.push('Consider code splitting')
    }

    if (chunk.category === 'vendor' && chunk.size > 1024 * 1024) {
      suggestions.push('Large vendor bundle - consider splitting vendors')
    }

    if (chunk.gzippedSize / chunk.size > 0.8) {
      suggestions.push('Poor compression ratio - check for binary data')
    }

    return suggestions
  }

  async analyzeAssets() {
    // Group assets by type
    const assetsByType = this.analysis.assets.reduce((groups, asset) => {
      groups[asset.type] = groups[asset.type] || []
      groups[asset.type].push(asset)
      return groups
    }, {})

    // Analyze each type
    Object.entries(assetsByType).forEach(([type, assets]) => {
      const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0)
      const largeAssets = assets.filter(asset => asset.size > this.options.thresholds.assetSize)

      this.analysis[`${type}Assets`] = {
        count: assets.length,
        totalSize,
        largeAssets: largeAssets.length,
        optimization: this.getAssetOptimization(type, assets)
      }
    })
  }

  getAssetOptimization(type, assets) {
    const suggestions = []

    if (type === 'image') {
      const largeImages = assets.filter(asset => asset.size > 100 * 1024)
      if (largeImages.length > 0) {
        suggestions.push(`${largeImages.length} large images found - consider optimization`)
      }
    }

    if (type === 'font') {
      if (assets.length > 4) {
        suggestions.push('Many font files - consider font subsetting')
      }
    }

    if (type === 'javascript') {
      const unminified = assets.filter(asset => !asset.path.includes('.min.'))
      if (unminified.length > 0) {
        suggestions.push('Unminified JavaScript files detected')
      }
    }

    return suggestions
  }

  async generateRecommendations() {
    const recommendations = []

    // Total size recommendations
    if (this.analysis.totalSize > this.options.thresholds.totalSize) {
      recommendations.push({
        type: 'size',
        priority: 'high',
        message: `Total bundle size (${this.formatSize(this.analysis.totalSize)}) exceeds recommended limit (${this.formatSize(this.options.thresholds.totalSize)})`
      })
    }

    // Chunk recommendations
    const largeChunks = this.analysis.chunks.filter(chunk => chunk.isLarge)
    if (largeChunks.length > 0) {
      recommendations.push({
        type: 'chunking',
        priority: 'medium',
        message: `${largeChunks.length} chunks are larger than recommended (${this.formatSize(this.options.thresholds.chunkSize)})`
      })
    }

    // Vendor bundle recommendations
    const vendorChunks = this.analysis.chunks.filter(chunk => chunk.category === 'vendor')
    const totalVendorSize = vendorChunks.reduce((sum, chunk) => sum + chunk.size, 0)
    if (totalVendorSize > 1024 * 1024) {
      recommendations.push({
        type: 'vendor',
        priority: 'medium',
        message: `Vendor bundles total ${this.formatSize(totalVendorSize)} - consider vendor splitting`
      })
    }

    // Compression recommendations
    const compressionRatio = this.analysis.gzippedSize / this.analysis.totalSize
    if (compressionRatio > 0.7) {
      recommendations.push({
        type: 'compression',
        priority: 'low',
        message: `Compression ratio is ${(compressionRatio * 100).toFixed(1)}% - check for binary content in bundles`
      })
    }

    // Asset optimization recommendations
    if (this.analysis.imageAssets && this.analysis.imageAssets.largeAssets > 0) {
      recommendations.push({
        type: 'assets',
        priority: 'medium',
        message: `${this.analysis.imageAssets.largeAssets} large images found - optimize images`
      })
    }

    // Tree shaking recommendations
    const unusedExports = await this.detectUnusedExports()
    if (unusedExports.length > 0) {
      recommendations.push({
        type: 'tree-shaking',
        priority: 'medium',
        message: `${unusedExports.length} potentially unused exports detected`
      })
    }

    this.analysis.recommendations = recommendations
  }

  async detectUnusedExports() {
    // Simplified unused export detection
    // In a real implementation, this would use AST analysis
    const jsChunks = this.analysis.chunks.filter(chunk => chunk.type === 'javascript')
    const suspiciousChunks = jsChunks.filter(
      chunk => chunk.path.includes('node_modules') && chunk.size > 200 * 1024
    )

    return suspiciousChunks.map(chunk => ({
      chunk: chunk.path,
      reason: 'Large dependency - check for unused exports'
    }))
  }

  async compareWithPrevious() {
    const previousAnalysisPath = this.options.outputPath

    if (fs.existsSync(previousAnalysisPath)) {
      try {
        const previousData = JSON.parse(fs.readFileSync(previousAnalysisPath, 'utf8'))

        this.analysis.comparison = {
          totalSizeDiff: this.analysis.totalSize - previousData.totalSize,
          gzippedSizeDiff: this.analysis.gzippedSize - previousData.gzippedSize,
          chunkCountDiff: this.analysis.chunks.length - previousData.chunks.length,
          assetCountDiff: this.analysis.assets.length - previousData.assets.length,
          previousTimestamp: previousData.timestamp
        }
      } catch (error) {
        console.warn('⚠️ Could not compare with previous analysis:', error.message)
      }
    }
  }

  async saveAnalysis() {
    try {
      fs.writeFileSync(this.options.outputPath, JSON.stringify(this.analysis, null, 2))
      console.log(`📊 Analysis saved to ${this.options.outputPath}`)
    } catch (error) {
      console.error('❌ Failed to save analysis:', error)
    }
  }

  printReport() {
    console.log('\n📊 Bundle Analysis Report')
    console.log('=' * 50)

    // Summary
    console.log('\n📈 Summary:')
    console.log(`  Total Size: ${this.formatSize(this.analysis.totalSize)}`)
    console.log(`  Gzipped Size: ${this.formatSize(this.analysis.gzippedSize)}`)
    console.log(
      `  Compression Ratio: ${((this.analysis.gzippedSize / this.analysis.totalSize) * 100).toFixed(1)}%`
    )
    console.log(`  Total Chunks: ${this.analysis.chunks.length}`)
    console.log(`  Total Assets: ${this.analysis.assets.length}`)

    // Comparison
    if (this.analysis.comparison) {
      console.log('\n📊 Comparison with Previous Build:')
      const sizeDiff = this.analysis.comparison.totalSizeDiff
      const sizeChange = sizeDiff >= 0 ? `+${this.formatSize(sizeDiff)}` : this.formatSize(sizeDiff)
      const changeIcon = sizeDiff > 0 ? '📈' : sizeDiff < 0 ? '📉' : '➖'
      console.log(`  Size Change: ${changeIcon} ${sizeChange}`)

      const gzipDiff = this.analysis.comparison.gzippedSizeDiff
      const gzipChange = gzipDiff >= 0 ? `+${this.formatSize(gzipDiff)}` : this.formatSize(gzipDiff)
      console.log(`  Gzipped Change: ${gzipChange}`)
    }

    // Top chunks
    console.log('\n📦 Largest Chunks:')
    this.analysis.chunks.slice(0, 5).forEach(chunk => {
      const sizeIndicator = chunk.isLarge ? '⚠️' : '✅'
      console.log(`  ${sizeIndicator} ${chunk.path}: ${this.formatSize(chunk.size)}`)
    })

    // Assets by type
    console.log('\n📁 Assets by Type:')
    const assetTypes = ['javascript', 'stylesheet', 'image', 'font', 'other']
    assetTypes.forEach(type => {
      const typeData = this.analysis[`${type}Assets`]
      if (typeData && typeData.count > 0) {
        console.log(`  ${type}: ${typeData.count} files, ${this.formatSize(typeData.totalSize)}`)
      }
    })

    // Recommendations
    if (this.analysis.recommendations.length > 0) {
      console.log('\n💡 Recommendations:')
      this.analysis.recommendations.forEach(rec => {
        const priorityIcon =
          rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🔵'
        console.log(`  ${priorityIcon} ${rec.message}`)
      })
    } else {
      console.log('\n✅ No optimization recommendations - bundle looks good!')
    }

    console.log('\n' + `${'=' * 50}`)
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  // Static methods for CLI usage
  static async analyzeProject(options = {}) {
    const analyzer = new BundleAnalyzer(options)
    return await analyzer.analyze()
  }

  static async generateOptimizationReport(analysisPath) {
    if (!fs.existsSync(analysisPath)) {
      throw new Error(`Analysis file not found: ${analysisPath}`)
    }

    const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'))

    const report = {
      timestamp: Date.now(),
      analysis: analysisPath,
      optimizations: []
    }

    // Generate detailed optimization suggestions
    analysis.recommendations.forEach(rec => {
      switch (rec.type) {
      case 'size':
        report.optimizations.push({
          type: 'Bundle Splitting',
          description: 'Implement code splitting to reduce initial bundle size',
          implementation: [
            'Use dynamic imports for route-based splitting',
            'Implement lazy loading for heavy components',
            'Split vendor libraries into separate chunks'
          ],
          expectedImpact: 'Reduce initial load time by 20-40%'
        })
        break

      case 'vendor':
        report.optimizations.push({
          type: 'Vendor Optimization',
          description: 'Optimize vendor bundle size',
          implementation: [
            'Use tree shaking to eliminate unused exports',
            'Replace large libraries with lighter alternatives',
            'Implement vendor chunk splitting'
          ],
          expectedImpact: 'Reduce vendor bundle size by 15-30%'
        })
        break

      case 'assets':
        report.optimizations.push({
          type: 'Asset Optimization',
          description: 'Optimize static assets',
          implementation: [
            'Compress images using WebP format',
            'Implement responsive images',
            'Use font subsetting for custom fonts',
            'Enable gzip/brotli compression'
          ],
          expectedImpact: 'Reduce asset sizes by 30-60%'
        })
        break
      }
    })

    return report
  }
}

// CLI support
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = {}

  // Parse command line arguments
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '')
    const value = args[i + 1]

    if (key === 'dist-path') options.distPath = value
    if (key === 'output') options.outputPath = value
    if (key === 'threshold-total') {
    {options.thresholds = { ...options.thresholds, totalSize: parseInt(value) }}
  }

  BundleAnalyzer.analyzeProject(options)
    .then(() => {
      console.log('✅ Bundle analysis complete!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Bundle analysis failed:', error.message)
      process.exit(1)
    })
}

export { BundleAnalyzer }
export default BundleAnalyzer
