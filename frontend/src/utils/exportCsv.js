/**
 * Exports data to CSV and triggers file download
 * @param {Array<Object>} data 
 * @param {string} filename 
 * @param {Array<{key: string, label: string}>} columns 
 */
export function exportToCsv(data, filename = 'export.csv', columns = null) {
  if (!data || !data.length) {
    alert('No data available to export.')
    return
  }

  const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }))
  
  // Header row
  const header = cols.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',')
  
  // Rows
  const rows = data.map(row => {
    return cols.map(c => {
      let val = row[c.key]
      if (val === undefined || val === null) val = ''
      if (typeof val === 'object') val = JSON.stringify(val)
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  })

  const csvContent = '\uFEFF' + [header, ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

