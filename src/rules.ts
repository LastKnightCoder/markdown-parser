// markdown parse rules
const rules = {
  'newline': /^(\s)*$/,
  'code': /^ {4}(.+)$/,
  'fences': /^`{3,} *(\S+)?\s*/,
  'hr': /^([-_*]){3,}\s*$/,
  'blockquote': /^> (.+)$/,
  'heading': /^(#{1,6}) (.+)/,
  'bulletedList': /^[-+*] (.+)/,
  'numberedList': /^(\d+)\. (.+)/,
}

export default rules;