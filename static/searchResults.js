function stops() {
    const parents = document.querySelectorAll('.route-dot');

    parents.forEach(parent => {
        const children = parent.querySelectorAll('.point');
        
        children.forEach((child, index) => {
            const left = (100/(children.length + 1)) * (index + 1) ;
            child.style.setProperty('left', `${left}%`);
});

})}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", stops);
  } else {
    stops();
  }