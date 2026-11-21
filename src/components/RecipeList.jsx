import { useEffect } from "react"
import { useState } from "react"

function RecipeList(){
    const [recipes,setRecipes] = useState([])
    const [selectRecipe,setSelectRecipe] = useState(null)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(true)
    const [search,setSearch] = useState('')
    const [dropdown,setDropdown] = useState('All')

    useEffect(()=>{
        async function fetchRecipes() {
            try{
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')

                if(!response.ok){
                    throw new Error('Couldnt fetch recipes')
                }

                const data = await response.json()
                setRecipes(data.meals || [])
            }catch(error){
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
        fetchRecipes()
    },[])

    async function fetchRecipe(id) {
        try{
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)

            if(!response.ok){
                throw new Error('Could not fetch recipe')
            }

            const data = await response.json()
            setSelectRecipe(data.meals[0])
        }catch(error){
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }

    //Search and Dropdown feature
    const filteredRecipes = recipes.filter((rec)=>{
        const searchRecipe = rec.strMeal.toLowerCase().includes(search.toLowerCase())
        const dropRecipe = dropdown === 'All' || rec.strCategory === dropdown
        return searchRecipe && dropRecipe
    })

    return(
        <div className="App">

        <div className="container py-4">
            <div>
                <h2 className="fw-bold mt-4 text-white">Recipe Finder</h2>
                <p className="text-white mb-5">Discover delicious recipes and learn how to prepare them.
                </p>
            </div>

            {loading && <p>Loading recipes...</p>}
            {error && <p className="alert alert-danger">{error}</p>}

            <input type="text"
            value={search}
            placeholder="Search Recipe..."
            className="form-control mb-3" 
            onChange={(event)=>setSearch(event.target.value)}
            />
            <form >
                <select value={dropdown} onChange={event=>setDropdown(event.target.value)} className="form-select mb-5">
                    <option value="All">All</option>
                    <option value="Chicken">Chicken</option>
                    <option value="Seafood">Seafood</option>
                    <option value="Dessert">Desert</option>
                    <option value="Vegetarian">Vegeterian</option>
                    <option value="Pasta">Pasta</option>
                </select>
            </form>

            {/* All recipes */}
            <div className="row g-4">
                {filteredRecipes.map((rec)=>(
                    <div className="col-12 col-sm-6 col-md-6" key={rec.idMeal}>
                        <div className="card h-100 shadow-sm p-2 recipe-Card">
                            <img src={rec.strMealThumb} alt={rec.strName} className="card-img-top recipe-image" style={{maxHeight:'350px',objectFit:'cover'}} />
                            <h5 className="fw-bold mt-3">{rec.strMeal}</h5>
                            <h6 className="text-muted">Category: {rec.strCategory}</h6>
                            <h6 className="text-muted">Cuisine: {rec.strArea}</h6>
                            <button className="btn btn-warning" onClick={()=>fetchRecipe(rec.idMeal)}>View Details</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Specific Recipe */}
            {selectRecipe && (
                <div className="col-12 col-sm-6 col-md-6">
                    <div className="card shadow-m p-2 mt-5" style={{maxWidth:'750px'}}>
                        <img src={selectRecipe.strMealThumb} alt={selectRecipe.strMeal} className="card-img-top recipe-image" />
                        <h5 className="fw-bold mt-3">{selectRecipe.strMeal}</h5>
                        <h6>Instructions</h6>
                        <p className="text-muted">{selectRecipe.strInstructions}</p>
                        <button className="btn btn-warning" onClick={()=>setSelectRecipe(null)}>Go Back</button>
                    </div>
                </div>
            )}
        </div>
        </div>

    )
}
export default RecipeList