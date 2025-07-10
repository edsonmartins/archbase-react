export function createElementFromHTML(htmlString: string): any {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.firstChild;
}

export function applyFontFamily(owner: any, fontFamily: string) {
  owner.style.fontFamily = fontFamily;

  for (let i = 0; i < owner.children.length; i++) {
    applyFontFamily(owner.children[i], fontFamily);
  }
}
