function parseStringLiteral(tokens, quoteMark) {
  let token;
  let parsed = '';
  let escapeFlag = false;
  while ((token = nextToken(tokens))) {
    if (escapeFlag) {
      parsed += '\\' + token;
      escapeFlag = false;
      continue;
    }
    switch (token) {
      case '\\':
        escapeFlag = true;
        break;
      case '"':
      case "'":
        if (token === quoteMark) {
          return parsed;
        }
      default:
        parsed += token;
        break;
    }
  }
  throw new Error('Unexpected end of expression');
}

function parseExpression(tokens) {
  let token;
  let parsed = '';
  let escape = false;
  while ((token = nextToken(tokens))) {
    switch (token) {
      case '{':
        parsed += '{' + parseExpression(tokens) + '}';
        break;
      case '`':
        parsed += '`' + parseTemplateExpression(tokens) + '`';
        break;
      case '"':
        parsed += '"' + parseStringLiteral(tokens, '"') + '"';
        break;
      case "'":
        parsed += "'" + parseStringLiteral(tokens, "'") + "'";
        break;
      case '}':
        return parsed;
      default:
        parsed += token;
        break;
    }
  }
  throw new Error('Unexpected end of expression');
}

function parseTemplateExpression(tokens, parseEscape = false) {
  let token;
  let parsed = '';
  let escapeFlag = false;
  while ((token = nextToken(tokens))) {
    if (escapeFlag) {
      parsed += unescape(token[0]) + token.substr(1);
      escapeFlag = false;
      continue;
    }
    switch (token) {
      case '\\':
        if (parseEscape) {
          escapeFlag = true;
        } else {
          parsed += '\\';
        }
        break;
      case '${':
        parsed += '${' + parseExpression(tokens) + '}';
        break;
      case '`':
        return parsed;
      default:
        parsed += token;
        break;
    }
  }
  return parsed;
}

function nextToken(tokens) {
  while (tokens.length) {
    const token = tokens.shift();
    if (token) {
      return token;
    }
  }
}

function unescape(character) {
  switch (character) {
    case 'n':
      return '\n';
    case 't':
      return '\t';
    default:
      return '\\' + character;
  }
}

export function parseTemplate(template) {
  // Simple template expression tokenizer
  const tokens = template.split(/(?:(\${|{|}|\'|\"|\`|\\))/g);

  // Parse tokens
  return parseTemplateExpression(tokens, true);
}
