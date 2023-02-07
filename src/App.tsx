import React, { useState, useEffect} from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Api from './config/Api';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsThreeDotsVertical, BsCheck2Circle, BsCalendar, BsCalendarCheck  } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import moment from 'moment'
import { MultiSelect } from "react-multi-select-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-bootstrap/Modal';
import parser from 'html-react-parser'


function App() {
  const [modalShow, setModalShow] = React.useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [after, setAfter] = useState('');
  const [dataList, setDataList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState('asc');
  const [openDate, setOpenDate] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [query, setQuery] = useState('');
  const [urlParams, setUrlParams] = useState('')

  var options = [
    { label: "is:archived", value: "archived", name: "archived" },
    { label: "not:archived", value: "not:archived", name: "archived" },
    { label: "is:completed", value: "completed", name: "completed" },
    { label: "is:shooting", value: "shooting", name: "shooting" },
    { label: "is:incompleted", value: "incompleted", name: "incompleted" },
    { label: "is:editing", value: "editing", name: "editing" },
    { label: "is:feedback", value: "feedback", name: "feedback" },
    { label: "educational", value: "educational", name: "educational" },
    { label: "testimonial", value: "testimonial", name: "testimonial" },
    { label: "training", value: "training", name: "training" },
    { label: "recreational", value: "recreational", name: "recreational" },
    { label: "after:"+after, value: "after:", name: "after" },
  ];

  var url = ""

  useEffect(() => {
    getDataList(urlParams)        
  }, [keyword]);

  const handleCloseModal = () => {
    setModalShow(false)
}

  const handleSelect = async (e) => {
    setDataList([])
    console.log(e)
    const index = e.length;
    setSelected(e)
    console.log(selected)
    for(let i=0; i<e.length; i++)
    {

      switch(e[i]['value'])
      {
        case 'archived':
          url = url+'&archived=true'
          break;
        
          case 'not:archived':
            url = url+'&archived=false'
            break;
        
          case 'completed':
            url = url+'&status_like=COMPLETED'
            break;
      
          case 'shooting':
            url = url+'&status_like=SHOOTING'
            break;
    
          case 'incompleted':
            url = url+'&status_like=INCOMPLETE'
            break;
  
          case 'editing':
            url = url+'&status_like=EDITING'
            break;

          case 'feedback':
            url = url+'&status_like=FEEDBACK'
            break;

          case 'educational':
            url = url+'&type_like=educational'
            break;

          case 'testimonial':
            url = url+'&status_like=testimonial'
            break;

          case 'training':
            url = url+'&type_like=training'
            break;

          case 'recreational':
            url = url+'&status_like=recreational'
            break;
          
          case 'after:':
            setModalShow(true)
            setOpenDate(true)
            break;
      }
    }
    console.log(url)
    setUrlParams(url)
    setDataList([])
    getDataList(url)
  }

  const handleSelectDate = async (e) => {
    setAfter(moment(e).format('YYYY-MM-DD'))
    url = url+'&createdOn_gte='+moment(e).format('YYYY-MM-DD')
    getDataList(url)
    setOpenDate(false)
    setModalShow(false)
  }

  const handleChange = async (e) => {
    setQuery(e.target.value)
    setKeyword(e.target.value)
    
    await Api().get(`projects?name_like=${keyword}&_sort=createdOn&_order=${sort}`)
    .then((response) => response)
    .then((data) => {
      console.log(data)
      setDataList([])
      if (data.status === 200)
      {
        if (data.data.length > 0 )
        {
          const listData = data.data; 
          setDataList(listData);
          console.log('listData', listData)
        }
      }
    })
    .catch((err) => {
    })
  }

  const getDataList = async (url) => {
    await Api().get(`projects?name_like=${keyword}&_sort=createdOn&_order=${sort}${url}`)
    .then((response) => response)
    .then((data) => {
      console.log(data)
      if (data.status === 200)
      {
        if (data.data.length > 0 )
        {
          const listData = data.data; 
          setDataList(listData);
          console.log('listData', listData)
        }
      }
    })
    .catch((err) => {
    })
  }

  const handleSortByAsc = async () => {
    setSort('asc')
    getDataList(url);
  }


  const handleSortByDesc = async () => {
    setSort('desc')
    getDataList(url);
  }

  var handleStatus = (status) => {
    switch(status)
    {
      case 'COMPLETED':
        return parser ( '<BsCheck2Circle className="icon-blue" /> <i className="blue">Completed</i>' )
        break;

      case 'FEEDBACK':
        return parser ( '<span className="icon-feedback">2/2</span> <i className="feedback">Waiting for Feedback</i>' )
        break;
      
      case 'EDITING':
        return parser ( '<span className="icon-editing">1/3</span> <i className="editing">Video Editing</i>' )
        break;
      
      case 'SHOOTING':
        return  parser ( '<BsCalendarCheck className="icon-blue" /> <i className="blue">Shoot Schedule</i>' )
        break;
      
      case 'INCOMPLETE':
        return parser ( '<AiOutlineLoading3Quarters className="icon-red" /> <i className="red">Form Incomplete</i>' )
        break;

    }
  }

  var handleType = (tipe) => {
    switch(tipe)
    {
      case 'educational':
        return 'Educational'
        break;

      case 'testimonial':
        return 'Testimonial'
        break;
      
      case 'training':
        return 'Corporate Training'
        break;
      
      case 'recreational':
        return 'Recreational'
        break;
    }
  }
  return (
    <div className="App">
      <Row>
        <Col lg={12}>
          <header className="App-header">
            <h1>Hello Hekta Hendra Priana.</h1>
            <p>Here are the list of project you submit</p>
          </header>
        </Col>
      </Row>
      <Card>
        <Card.Header>
          <Row>
            <Col md="12">
              <h3>Recent Projects</h3>
            </Col>
          </Row>
          <Row>
            <Col md="2">
              <NavDropdown title="Sort By" className='' id="basic-nav-dropdown">
                <NavDropdown.Item href="#" onClick={handleSortByAsc} className={ sort === '' || sort === 'asc' ? 'bold' : '' }>Sort By Date Asc</NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleSortByDesc} className={ sort === 'desc' ? 'bold' : '' }>Sort By Date Desc</NavDropdown.Item>
              </NavDropdown>
            </Col>
            <Col md="3">
              <Form>
                <Row className="mb-3">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2 input-search"
                    aria-label="Search"
                    defaultValue={query}
                    onChange={handleChange}
                  />
                  <Button type="button" className="btn-search"><FiSearch /></Button>
                </Row>
              </Form>
            </Col>
            <Col md="7">
              <MultiSelect
                options={options}
                value={selected}
                onChange={handleSelect}
                labelledBy="Filter"
                className="input-multiple"
              />
            </Col>
          </Row>
          
        </Card.Header>
        <Card.Body>
          <Row>
            <Col lg={12}>
              <Table className="tbl">
                <thead className='thead'>
                  <tr>
                    <th className="col-1">Name</th>
                    <th className="col-2">Type</th>
                    <th className="col-3">Status</th>
                    <th className="col-4">Created</th>
                    <th className='text-center col-5'>Manage</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    dataList.map((item, i) => (
                      <tr key={i}>
                        <td className='col-1'>{item['name']}</td>
                        <td className='col-2'>{handleType(item['type'])}</td>
                        <td className='col-3'>{handleStatus(item['status'])}</td>
                        <td className='col-4'>{moment(item['createdOn']).format('MMM DD, YYYY')}</td>
                        <td className='text-center col-5'>
                          <NavDropdown title={<BsThreeDotsVertical />} className='' id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">Edit</NavDropdown.Item>
                          </NavDropdown>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal 
        show={modalShow} 
        onHide={handleCloseModal}
        dialogClassName="modal-90w"
        scrollable={fullscreen}
      >
        <Modal.Body>
          <DatePicker 
            selected={startDate}
            defaultValue={new Date()}
            onChange={handleSelectDate} 
            className={openDate === true ? 'show input-ground' : 'hide input-ground'}
          />
        </Modal.Body>
      </Modal>
    </div>
    
  );
}

export default App;
