const divs = [
  'welcome',
  'rgb-hsi-decomposition',
  'scale',
  'rotate',
  'draw',
  'composition'
]

function showOnlyDiv (id) {
  divs.forEach(el => {
    if (el === id) {
      document.getElementById(el).style.display = 'inline-block'
    } else {
      document.getElementById(el).style.display = 'none'
    }
  })

}
