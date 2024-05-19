function Pokemon({ name, image}){
    return(
        <div>
            <div>{name}</div>
            <div><img src={image} alt="img" /></div>
        </div>
    )
}


export default Pokemon;