import React, { Component } from "react"
import ReactDOM from "react-dom"
import { hashHistory, browserHistory, Link } from "react-router"
import AbcHeader from "./common/header"
import "../css/dicApi.css"
import "../css/tab.css"
import preview9 from "../images/preview9.png"
import preview7 from "../images/preview7.png"

class Pandect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      typeApi:
        "http://10.12.10.10:9500/api/1.0/types?start_time=<>&offset=<>&limit=<>",
      wordsApi:
        "http://10.12.10.10:9500/api/1.0/words?types=<>start_time=<>&offset=<>&limit=<>",
      synoApi:
        "http://10.12.10.10:9500/api/1.0/synonyms?word=<>?start_time=<>&offset=<>&limit=<>",
      readApi: "http://index/detail?cname=<>&id=<>",
      selectApi:"http://search/synonyms?q=&limit=&offset="
    }
  }
  render() {
    return (
      <div className="dicApi">
        <AbcHeader {...this.props} />
        <div className="total">
          <div className="title">
            <span>获取词分类API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>{this.state.typeApi}</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
            <div className="arg">
              <div className="left">
                   <p>arg:</p>
                   <p>resp:</p>
              </div>
              <div className="right">
                <div className="rContent">
                <span>type:[可选],词类英文名，不选时，返回所有分类词 </span>
                <span>
                  start_time:[可选],格式"2018-01-01"，从该时间点后的新增的词分类，无此参数，包含所有天{" "}
                </span>
                <span>offset:[可选], 分页偏移;</span>
                <span>limit:[可选], 每页总条数：0,为所有： 默认1000 </span>
                <span>status: 返回状态，0：成功；其他：失败；</span>
                <span>total:总条数</span>
                <span> data: 词分类列表</span>
                <ul>
                  <li> en:  词类英文名；</li>
                  <li>zh:词类中文名；</li>
                </ul>
              </div>
              </div>
             
            </div>
        
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span>获取词API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>{this.state.wordsApi}</p>
            </div>
             <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
             <div className="arg">
              <div className="left">
                   <p>arg:</p>
                   <p>resp:</p>
              </div>
              <div className="right">
                <div className="rContent">
                <span>type:[可选],词类英文名，不选时，返回所有分类词 </span>
                <span>
                  start_time:[可选],格式"2018-01-01"，从该时间点后的新增的词分类，无此参数，包含所有天{" "}
                </span>
                <span>offset:[可选], 分页偏移;</span>
                <span>limit:[可选], 每页总条数：0,为所有： 默认1000 </span>
                <span>status: 返回状态，0：成功；其他：失败；</span>
                <span>total:总条数</span>
                <span> data: 词分类列表</span>
                 <ul>
                  <li>type: 词类；</li>
                  <li>word： 词</li>
                </ul>
              </div>
              </div>   
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span>获取同义词API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>{this.state.synoApi}</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
           <div className="arg">
              <div className="left">
                   <p>arg:</p>
                   <p>resp:</p>
              </div>
              <div className="right">
                <div className="rContent">
                <span>type:[可选],词类英文名，不选时，返回所有分类词 </span>
                <span>
                  start_time:[可选],格式"2018-01-01"，从该时间点后的新增的词分类，无此参数，包含所有天{" "}
                </span>
                <span>offset:[可选], 分页偏移;</span>
                <span>limit:[可选], 每页总条数：0,为所有： 默认1000 </span>
                <span>status: 返回状态，0：成功；其他：失败；</span>
                <span>total:总条数</span>
                <span> data: 词分类列表</span>
                  <ul>
                  <li> word: 词类；</li>
                  <li>synonym: 词；</li>
                </ul>
              </div>
              </div>   
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span>添加缺失词API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>http://114.55.100.198:8081/feedback/add-lacking</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>post</p>
            </div>
            <div className="api">
              <p>form_param:</p>
              <p>name</p>
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span>缺失词结果展示API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>http://114.55.100.198:8081/feedback/lacking</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
            <div className="arg" style={{height:'202px'}}>
              <div className="left" style={{height:'202px'}}>
                <p>query_param:</p>
              </div>
              <div className="right" style={{height:'202px'}}>
                <div className="rContent">
                  <span>sort:需要排序的字段 </span>
                  <span>
                    order:升序=asc | 降序=desc
                  </span>
                  <span>offset:分页偏移量，默认为0</span>
                  <span>limit:分页大小， 默认100 </span>
                </div>
              </div>   
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span>添加新词API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>http://114.55.100.198:8081/feedback/add-new</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>post</p>
            </div>
            <div className="api">
              <p>form_param:</p>
              <p>name</p>
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span>新词结果展示API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>http://114.55.100.198:8081/feedback/new</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
            <div className="arg" style={{height:'202px'}}>
              <div className="left" style={{height:'202px'}}>
                <p>query_param:</p>
              </div>
              <div className="right" style={{height:'202px'}}>
                <div className="rContent">
                  <span>sort:需要排序的字段 </span>
                  <span>
                    order:升序=asc | 降序=desc
                  </span>
                  <span>offset:分页偏移量，默认为0</span>
                  <span>limit:分页大小， 默认100 </span>
                </div>
              </div>   
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span style={{width:'200px'}}>获取词性目录列表API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>http://114.55.100.198:8081/feedback/catalog</p>
            </div>
            <div className="api" style={{borderBottom:'none'}}>
              <p>method:</p>
              <p>get</p>
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span>反馈词和词性API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>http://114.55.100.198:8081/feedback/add-class</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>post</p>
            </div>
            <div className="arg" style={{height:'300px'}}>
              <div className="left" style={{height:'300px'}}>
                <p style={{height:'300px',lineHeight:'300px'}}>json_param:</p>
              </div>
              <div className="right" style={{height:'300px'}}>
                <div className="rContent">
                  <p style={{marginTop:'20px'}}>词性列表参数格式：</p>
                  <p style={{marginLeft:'20px'}}>[</p>
                  <p style={{marginLeft:'30px',marginTop:'0'}}>{"{"}</p>
                  <p style={{marginLeft:'40px'}}>dict_word:"1347 Property Insurance Holdings, Inc",</p>
                  <p style={{marginLeft:'40px'}}>classifrcation:"上市公司_美国",</p>
                  <p style={{marginLeft:'40px'}}>create_time:"2017-01-01"</p>
                  <p style={{marginLeft:'30px'}}>{"},"}</p>
                  <p style={{marginLeft:'30px',marginTop:'0'}}>{"{"}</p>
                  <p style={{marginLeft:'40px'}}>dict_word:"*ST三鑫",</p>
                  <p style={{marginLeft:'40px'}}>classifrcation:"上市公司_中国大陆",</p>
                  <p style={{marginLeft:'40px'}}>create_time:""</p>
                  <p style={{marginLeft:'30px'}}>{"}"}</p>
                  <p style={{marginLeft:'20px'}}>]</p>
                  {/* <div dangerouslySetInnerHTML={{__html: `<p>[<br>
                      <i></i><br>
                        dict_word:"1347 Property Insurance Holdings, Inc",
                        classifrcation:"上市公司_美国",
                        create_time:"2017-01-01"
                      },
                      {
                        dict_word:"*ST三鑫",
                        classifrcation:"上市公司_中国大陆",
                        create_time:""
                      }
                    ]</p>`}}> 
                  </div>*/}
                </div>
              </div>   
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span>只读模式列表API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>{this.state.readApi}</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
            <div className="arg" style={{height:'202px'}}>
              <div className="left" style={{height:'202px'}}>
                <p>query_param:</p>
              </div>
              <div className="right" style={{height:'202px'}}>
                <div className="rContent">
                  <span>cname:词库总揽的cname或index的cname属性 </span>
                  <span>
                    id:目录的cid或index_id，该参数和cname可一起传，可使返回结果更精确（还未完善）
                  </span>
                  <span>offset:默认为0</span>
                  <span>limit:默认100 </span>
                </div>
              </div>   
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span style={{width:'250px'}}>只读模式列表详情API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>{this.state.readApi}</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
            <div className="arg" style={{height:'102px'}}>
              <div className="left" style={{height:'102px'}}>
                <p style={{height:'102px',lineHeight:'102px'}}>query_param:</p>
              </div>
              <div className="right" style={{height:'102px'}}>
                <div className="rContent">
                  <span>cid:当前分类的cid </span>
                  <span style={{borderBottom:'none'}}>
                    dict_word:当前词条的dict_word
                  </span>
                </div>
              </div>   
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span style={{width:'250px'}}>搜索词性API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>{this.state.selectApi}</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
            <div className="arg" style={{height:'153px'}}>
              <div className="left" style={{height:'153px'}}>
                <p style={{height:'153px',lineHeight:'153px'}}>query_param:</p>
              </div>
              <div className="right" style={{height:'153px'}}>
                <div className="rContent">
                  <span>q:要搜索的字段 </span>
                  <span>
                    limit:
                  </span>
                  <span style={{borderBottom:'none'}}>
                    offset:
                  </span>
                </div>
              </div>   
            </div>
          </div>
        </div>

        <div className="total">
          <div className="title">
            <span style={{width:'250px'}}>搜索同义词API</span>
          </div>
          <div className="main">
            <div className="api">
              <p>api:</p>
              <p>{this.state.selectApi}</p>
            </div>
            <div className="api">
              <p>method:</p>
              <p>get</p>
            </div>
            <div className="arg" style={{height:'153px'}}>
              <div className="left" style={{height:'153px'}}>
                <p style={{height:'153px',lineHeight:'153px'}}>query_param:</p>
              </div>
              <div className="right" style={{height:'153px'}}>
                <div className="rContent">
                  <span>q:要搜索的字段 </span>
                  <span>
                    limit:
                  </span>
                  <span style={{borderBottom:'none'}}>
                    offset:
                  </span>
                </div>
              </div>   
            </div>
          </div>
        </div>

      </div>
    )
  }
}
export default Pandect
