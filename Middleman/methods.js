const getPrimitiveRoot = (prime) => {

    for(let i = 2; i < prime ; i++) {
        let x = 1; 
        let st = new Set(); 
        for(let j = 1; j < prime; j++) { 
            x = x * i ; 
            st.add(x % prime); 
        }
        if(st.size === prime - 1){ 
            return i; 
        }
    }
    return -1; 
}

const powerMod = (a, b, m) => { // g^a % p 
    return Math.pow(a, b) % m; 
}

module.exports = { 
    getPrimitiveRoot,
    powerMod 
}; 