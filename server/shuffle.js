module.exports = function shuffle(array,) {
    array = [...array];
    let copy = [];
    let n = array.length;
  
    while (n) {
        copy.push(array.splice(Math.floor(Math.random() * n--), 1)[0]);
    }
  
    return copy;
}