const { getAllByRole } = require('@testing-library/dom')

const getTableCells = (element) =>
  getAllByRole(element, 'row')
    .map((row, index) => {
      const type = index === 0 ? 'columnheader' : 'cell'
      return getAllByRole(row, type)
        .map(cell => cell.textContent.trim())
    })

module.exports = { getTableCells }
