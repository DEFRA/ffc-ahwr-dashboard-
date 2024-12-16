import './css/application.scss'
import './css/document-list.scss'
import './css/devolved-nations.scss'
import './css/contents-list.scss'
import './css/print-link.scss'
import './css/govspeak.scss'
import './css/organisation-logo.scss'
import './js/cookies'
import './js/handleDuplicateFormSubmissions'

window.$ = require('jquery')
const moj = require('@ministryofjustice/frontend')

const $sortableTables = document.querySelectorAll('[data-module="moj-sortable-table"]')
moj.nodeListForEach(
  $sortableTables,
  (table) => new moj.SortableTable({ table })
)
