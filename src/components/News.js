import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';



export default class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 8,
        category: 'general'
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }
    constructor(props) {
        super(props);
        console.log("Hello I am constructor from news component");
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkeys`
    }

    async updateNews() {
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apikey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
        this.setState({
            loading: true
        })
        let data = await fetch(url);
        // console.log(data);
        this.props.setProgress(30);

        let parsedData = await data.json()
        console.log(parsedData);
        this.props.setProgress(70);
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false
        })
        this.props.setProgress(100)
    }

    async componentDidMount() {
        this.updateNews()
    }

    // handlePreviousClick = async () => {
    //     console.log("previous");
    //     this.setState({ page: this.state.page - 1 })
    //     this.updateNews();

    // }

    // handleNextClick = async () => {
    //     console.log("Next");
    //     this.setState({ page: this.state.page + 1 })
    //     this.updateNews();
    // }

    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 })
        // this.updateNews();
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=${this.props.apikey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
        let data = await fetch(url);
        // console.log(data);
        let parsedData = await data.json()
        console.log(parsedData.totalResults);
        console.log(parsedData);
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
        })
        console.log("length of article", this.state.articles.length);
    };

    render() {
        // console.log("render");
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px' }}>Top Headlines - {this.capitalizeFirstLetter(this.props.category)}</h1>
                {this.state.loading && <Spinner/>}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner/>}
                >
                    <div className="container">
                        <div className="row">
                            {/* {!this.state.loading && this.state.articles.map((element) => { */}

                            {this.state.articles.map((element, index) => {
                                return <div className="col-md-4" key={index}>
                                {/* return <div className="col-md-4" key={element.content}> */}
                                    <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
                {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} onClick={this.handlePreviousClick} type="button" className="btn btn-dark"> &larr;Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} onClick={this.handleNextClick} type="button" className="btn btn-dark">Next &rarr;</button>
                </div> */}
            </>
        )
    }
}

