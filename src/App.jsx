import { useState } from 'react'
import './App.css'
import classNames from 'classnames'
import axios from 'axios'

const Button = ({ value, onClick, bold = false, theme }) => {
  return (
    <div
      className={classNames(
        'border border-1 border-gray-300 p-6 text-center rounded hover:cursor-pointer select-none',
        bold ? 'font-bold' : '',
        theme === "dark" ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-black hover:bg-gray-100",
      )}
      style={{
        cursor: 'pointer',
      }}
      onClick={onClick}
      value={value}
    >
      {value}
    </div>
  )
}

function App() {
  const buttons = ['CE', 'C', '⌫', '÷', '1', '2', '3', 'x', '4', '5', '6', '—', '7', '8', '9', '+', '±', '0', '.', '=']
  const [theme, setTheme] = useState("light")
  const [history, setHistory] = useState([])
  const [conversion, setConversion] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showConversion, setShowConversion] = useState(false)
  const [conversionTab, setConversionTab] = useState("currency")
  const [cryptoRates, setCryptoRates] = useState([])
  const [crypto, setCrypto] = useState(null)

  const [values, setValues] = useState({
    leftValue: null,
    rightValue: null,
    operator: null,
    result: null,
    inputValue: "0",
  })

  const cryptos = ['BTC', 'ETH', 'LTC', 'XRP', 'DOGE', 'LTC', 'XMR', 'BCH']
  //clear the console
  console.log(values)
  const addNumber = (value) => {
    if (values?.inputValue === "0") {
      setValues({
        ...values,
        inputValue: value,
      })
    } else {
      setValues({
        ...values,
        inputValue: values.inputValue + value,
      })
    }
  }

  const handleOperator = (value) => {
    if (!values?.operator) {
      setValues({
        ...values,
        operator: value,
        leftValue: values.inputValue,
        inputValue: "0",
      })
    } else {
      if (!values.result) {
        setValues({
          ...values,
          operator: value,
          rightValue: values.inputValue,
          inputValue: "0",
        })
      } else {
        setValues({
          ...values,
          operator: value,
          leftValue: values.inputValue,
          rightValue: values.inputValue,
          inputValue: "0",
          result: null,
        })
      }
    }
  }

  const makeDecimal = () => {
    if (values.inputValue.toString().indexOf(".") === -1) {
      setValues({
        ...values,
        inputValue: values.inputValue + ".",
      })
    }
  }

  const handleAbsolute = () => {
    if (values.inputValue != "0") {
      if (values.inputValue < 0) {
        setValues({
          ...values,
          inputValue: Math.abs(values.inputValue),
        })
      } else if (values.inputValue > 0) {
        setValues({
          ...values,
          inputValue: -Math.abs(values.inputValue),
        })
      }
    }
  }

  const fetchConversion = async () => {
    if (values.inputValue === "0") {
      return
    }

    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      const data = response.data
      const rates = data.rates
      const conversionData = Object.keys(rates).map((key) => {
        return {
          currency: key,
          rate: rates[key],
        }
      }
      )
      setConversion(conversionData)
    } catch (error) {
      console.error("Error fetching conversion data:", error)
    }
  }


  const handleDelete = () => {
    if (values.inputValue.length > 1) {
      setValues({
        ...values,
        inputValue: values.inputValue.slice(0, -1),
      })
    } else {
      setValues({
        ...values,
        inputValue: "0",
      })
    }
  }

  const clearEntry = () => {
    setValues({
      ...values,
      inputValue: "0",
      leftValue: "0",
      rightValue: "0",
      operator: null,
      result: null,
    })
  }

  const buttonHandler = (item) => {
    if (item === "CE") {
      clearEntry()
    } else if (item === "C") {
      setValues({
        ...values,
        inputValue: "0",
      })
    } else if (item === "⌫") {
      handleDelete()
    } else if (item === "±") {
      handleAbsolute()
    } else if (item === "=") {
      // calculate the result
      if (!values.operator) {
        return
      }

      if (values.leftValue && values.rightValue && values.result) {
        return
      }

      const left = parseFloat(values.leftValue)
      const right = parseFloat(values.inputValue)
      let res = null
      switch (values.operator) {
        case "+":
          res = left + right
          break
        case "-":
          res = left - right
          break
        case "x":
          res = left * right
          break
        case "÷":
          res = left / right
          break
        default:
          break
      }
      setHistory([...history, {
        leftValue: values.leftValue,
        operator: values.operator,
        rightValue: values.inputValue,
        result: res
      }])
      setValues({
        ...values,
        inputValue: res,
        rightValue: values.inputValue,
        result: res,
      })
    } else if (item === ".") {
      makeDecimal()
    } else if (item === "x" || item === "÷" || item === "-" || item === "+") {
      handleOperator(item)
    } else {
      addNumber(item)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div
          className={
            classNames(
              'flex flex-col items-center justify-center border border-1 border-gray-300 rounded-lg shadow-lg pt-1 pb-2 px-2 truncate relative',
              theme === "light" ? "bg-white" : "bg-gray-800",
            )
          } style={{ maxWidth: 320 }}>
          <div className='flex justify-between items-center mb-1' style={{ width: "100%" }}>
            <div className={
              classNames(
                'flex gap-2 items-center select-none',
                theme === "light" ? "text-black" : "text-white",
              )
            }>
              <div className={
                classNames(
                  'cursor-pointer rounded p-1',
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700",
                )
              } onClick={() => {
                setShowHistory(!showHistory)
                setShowConversion(false)
              }}>
                {showHistory ? "Calculator" : "History"}
              </div>
              <div className={
                classNames(
                  'cursor-pointer rounded p-1',
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700",
                )
              }
                onClick={() => {
                  if (values.inputValue === "0") {
                    return
                  }

                  if (showConversion) {
                    setShowConversion(false)
                    setConversionTab("currency")
                    setCrypto(null)
                    setCryptoRates([])
                    return
                  }

                  setShowConversion(!showConversion)
                  setShowHistory(false)
                  if (!showConversion) {
                    fetchConversion()
                  }
                }}
              >
                Convert
              </div>
              <div className={
                classNames(
                  'cursor-pointer rounded p-1',
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700",
                )
              } onClick={() => {
                setTheme(theme === "light" ? "dark" : "light")
              }}>
                {
                  theme === "light" ? "🌙" : "☀️"
                }
              </div>
            </div>
            <div>
              <div className='flex gap-2 items-center justify-center'>
                <div className='bg-yellow-500 hover:bg-yellow-400 rounded-full p-1 cursor-pointer text-sm h-4 w-4'>
                </div>
                <div className='bg-gray-200 hover:bg-gray-400 rounded-full p-1 cursor-pointer text-sm h-4 w-4'>
                </div>
                <div className='bg-red-500 hover:bg-red-400 rounded-full p-1 cursor-pointer text-sm h-4 w-4'>
                </div>
              </div>
            </div>
          </div>
          <div className={
            classNames(
              'border border-1 border-gray-300 p-4 text-right mb-4 screen font-bold text-3xl truncate pt-0',
              theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white",
              values.inputValue.length > 10 ? "text-sm" : "text-3xl",
            )
          }>
            <div>
              {/* if the leftValue and the operator are set then show the operator */}
              <div className='text-sm mt-4 h-6'>
                {values.operator !== null && values.leftValue !== "0" && (
                  <span>
                    {values.leftValue}&nbsp;{values.operator}&nbsp;
                    {
                      values.rightValue !== "0" && values.result !== null && (
                        <span>
                          {values.rightValue} =
                        </span>
                      )
                    }
                  </span>
                )}
              </div>
            </div>
            <span>
              {values.inputValue}
            </span>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <div className='grid grid-cols-4 gap-2'>
              {
                buttons.map((item, index) => {
                  return (
                    <Button
                      key={index}
                      theme={theme}
                      onClick={() => buttonHandler(item)}
                      value={item}
                      bold={item === "x" || item === "÷" || item === "-" || item === "+"}
                    />
                  )
                })
              }
            </div>
          </div>
          {
            showHistory && (
              <div id="history" className={
                classNames(
                  'w-full h-130 overflow-y-auto border border-1 border-gray-300 p-2 mt-4 rounded-lg bg-gray-50 absolute bottom-0 left-0',
                  theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white",
                )
              }>
                <div className='flex flex-col gap-2'>
                  {
                    history.map((item, index) => {
                      return (
                        <div key={index} className='flex justify-between items-center'>
                          <div className='text-sm'>
                            {item.leftValue} {item.operator} {item.rightValue} = {item.result}
                          </div>
                          <div className='cursor-pointer hover:bg-gray-100 rounded p-1 relative' onClick={() => {
                            setHistory(history.filter((_, i) => i !== index))
                          }}>
                            X
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
          {
            showConversion && (
              <div id="conversion" className={
                classNames(
                  'w-full h-130 overflow-y-auto border border-1 border-gray-300 p-2 mt-4 rounded-lg bg-gray-50 absolute bottom-0 left-0',
                  theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white",
                )
              }>
                <div className='flex justify-between gap-2 py-2 pb-4'>
                  <div className='p-3 cursor-pointer border border-1 border-black rounded-full' onClick={() => setConversionTab('currency')}>Currency</div>
                  <div className='p-3 cursor-pointer border border-1 border-black rounded-full' onClick={() => setConversionTab('crypto')}>Crypto</div>
                </div>
                {
                  conversionTab === "currency" && (
                    <div className='flex flex-col gap-2 px-3'>
                      {
                        conversion.map((item, index) => {
                          return (
                            <div key={index} className='flex justify-between items-center border-b-1'>
                              <div className='text-sm'>
                                {item.currency}: {(item.rate * values.inputValue).toFixed(0)}
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                }
                {
                  conversionTab === "crypto" && (
                    <div>
                      <div className='grid grid-cols-3 gap-2'>
                        {
                          cryptos.map((item, index) => {
                            return (
                              <div key={index} className='flex justify-between items-center border border-1 rounded-lg p-2 justify-center cursor-pointer'
                                onClick={async () => {
                                  //get rates from https://min-api.cryptocompare.com/data/price?fsym=${CRYPTO}}&tsyms=usd,eur,gbp
                                  const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${item}&tsyms=usd,eur,gbp`)
                                  const data = response.data
                                  setCryptoRates(data)
                                  setCrypto(item)
                                }}
                              >
                                <div className='text-sm'>
                                  {item}
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>

                      {
                        crypto && (
                          <div className='p-2 mt-4 border border-1 rounded-lg'>
                            <div className='text-sm mb-4'>
                              Rates for {values.inputValue} {crypto}:
                            </div>
                            <div className='flex flex-col gap-2'>
                              {
                                Object.keys(cryptoRates).map((item, index) => {
                                  return (
                                    <div key={index} className='flex justify-between items-center'>
                                      <div className='text-sm'>
                                        {item}: {(cryptoRates[item] * values.inputValue).toFixed(0)}
                                      </div>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        )
                      }
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
      </div >
    </>
  )
}

export default App
