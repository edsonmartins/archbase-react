export function ArchbaseError(this: any, message) {
  this.message = message
  this.name = 'ArchbaseError'
}

export function ArchbaseServiceError(this: any, message) {
  this.message = message
  this.name = 'ArchbaseServiceError'
}

export function ArchbaseDataSourceError(this: any, message) {
  this.message = message
  this.name = 'ArchbaseDataSourceError'
}
