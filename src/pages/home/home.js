import React from 'react'
import { getUser } from '../../infra/local-storage'
import { Redirect } from 'react-router-dom'
import PostIt from '../../components/postit'
import { getPostitsApi} from '../../apis/postit.api'

import './home.css'

//-- Página com todos os postits! Quando a página carregar, todos eles devem ser carregados juntos 

class Home extends React.Component {
    constructor(){  //tudo que for declaração de variável fica no constructor()
        super()
        this.state = {
            postits : [], //começa com a lista vazia, sem postits 
            postitsFilters: [] //lista de post its filtrados de acordo com o search
        }
    }
    componentDidMount() { //request para API dentro de um componente, logo que a página carrega. 
        console.log('hello componentDidMount foi criado')
        this.getPostits() //Aqui é onde ele lista os postits da API, e retorna uma lista de postits
    }
    componentWillUnmount() {
        console.log('hello componentWillUnmount morreu :(')
    }

    getPostits = () => { //faz a requisição pra API pra retornar a lista de post its cadastradas no backend
        getPostitsApi() //request API
            .then((response) => {
                console.log(response)
                this.setState({  //guarda as informações que chega da API
                    postits : response.data.todo.reverse()  //lista todos os post its
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    onFilterPostit = (e) => {
        const value = e.target.value.toLowerCase()
        const postits = this.state.postits.filter((item)=> { //looping do for simplificado
            // console.log(item)
            return item.title.toLowerCase().indexOf(value) !== -1
        })
        // console.log(postitsFilter, 'postitfilter')
        this.setState({
            postitsFilters : postits
        })
    }

    render(){
        const user = this.props.user ? this.props.user : getUser()
        const postits = this.state.postitsFilters.length > 0 ? this.state.postitsFilters : this.state.postits
        if(user){ //se tiver um user logado
             return ( 
                    <div className='home'>
                        <input placeholder='Pesquisar' onChange={this.onFilterPostit} type='text' className='home__search' />
                        <div>
                            <PostIt updatePostits = {this.getPostits}/> 
                            {postits.map((item, index) => ( //for simplificado, que itera pelos post its
                                    // console.log('item', item)
                                <PostIt 
                                    key={item._id} //props do React (identificador da lista de elementos, necessário para funcionar)
                                    id={item._id} //id único de cada postit
                                    title={item.title}
                                    text={item.desc}
                                    color={item.color}
                                    updatePostits = {this.getPostits} //atualiza os post its, chamando essa function quando 
                                    //o post it for concluído
                                />                      
                            ))}
                        </div>
                    </div>
                )
            } else {
                return <Redirect to='/login' />
            }
    }
} 
export default Home
