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
  const [inputValue, setInputValue] = useState("0")
  const [result, setResult] = useState(null)
  const [operator, setOperator] = useState(null)
  const [leftValue, setLeftValue] = useState(null)
  const [rightValue, setRightValue] = useState(null)
  const [theme, setTheme] = useState("light")
  const [history, setHistory] = useState([])
  const [conversion, setConversion] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [showConversion, setShowConversion] = useState(false)
  const [conversionTab, setConversionTab] = useState("currency")
  const [cryptoRates, setCryptoRates] = useState([])
  const [crypto, setCrypto] = useState(null)
  const cryptos = ['BTC', 'ETH', 'LTC', 'XRP', 'DOGE', 'LTC', 'XMR', 'BCH']
  //clear the console
  // console.clear()
  console.log("operator: " + operator, "leftValue: " + leftValue, "rightValue: " + rightValue, "result: " + result, "inputValue: " + inputValue)

  // console.log(leftValue)
  const addNumber = (value) => {
    if (inputValue === "0") {
      setInputValue(value)
    } else {
      setInputValue(inputValue + value)
    }
  }

  const handleOperator = (value) => {
    if (!operator) {
      setLeftValue(inputValue)
      setOperator(value)
      setInputValue("0")
    } else {
      if (!result) {
        setRightValue(inputValue)
        setOperator(value)
        setInputValue("0")
      } else {
        setLeftValue(inputValue)
        setOperator(value)
        setRightValue(inputValue)
        setInputValue("0")
        setResult(null)
      }
    }
  }

  const makeDecimal = () => {
    if (inputValue.toString().indexOf(".") === -1) {
      setInputValue(inputValue + ".")
    }
  }

  const handleAbsolute = () => {
    if (inputValue != "0") {
      if (inputValue < 0) {
        setInputValue(Math.abs(inputValue))
      } else if (inputValue > 0) {
        setInputValue(-Math.abs(inputValue))
      }
    }
  }

  const fetchConversion = async () => {
    if (inputValue === "0") {
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
    if (inputValue.length > 1) {
      setInputValue(inputValue.slice(0, -1))
    } else {
      setInputValue("0")
    }
  }

  const clearEntry = () => {
    setResult(null)
    setOperator(null)
    setLeftValue("0")
    setRightValue("0")
    setInputValue("0")
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
                  if (inputValue === "0") {
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
              {/** create 3 buttons, one yellow for minimizing, one gray and one red, the buttons must darken their colors on hover */}
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
              inputValue.length > 10 ? "text-sm" : "text-3xl",
            )
          }>
            <div>
              {/* if the leftValue and the operator are set then show the operator */}
              <div className='text-sm mt-4 h-6'>
                {operator !== null && leftValue !== "0" && (
                  <span>
                    {leftValue}&nbsp;{operator}&nbsp;
                    {
                      rightValue !== "0" && result !== null && (
                        <span>
                          {rightValue} =
                        </span>
                      )
                    }
                  </span>
                )}
              </div>
            </div>
            <span>
              {inputValue}
            </span>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <div className='grid grid-cols-3 gap-2'>
              <Button theme={theme}
                onClick={() => clearEntry()} value="CE" />
              <Button theme={theme} onClick={() => clearEntry()} value="C" />
              <Button theme={theme} onClick={() => handleDelete()} value="⌫" />
              <Button theme={theme} onClick={() => addNumber("1")} value="1" />
              <Button theme={theme} onClick={() => addNumber("2")} value="2" />
              <Button theme={theme} onClick={() => addNumber("3")} value="3" />
              <Button theme={theme} onClick={() => addNumber("4")} value="4" />
              <Button theme={theme} onClick={() => addNumber("5")} value="5" />
              <Button theme={theme} onClick={() => addNumber("6")} value="6" />
              <Button theme={theme} onClick={() => addNumber("7")} value="7" />
              <Button theme={theme} onClick={() => addNumber("8")} value="8" />
              <Button theme={theme} onClick={() => addNumber("9")} value="9" />
              <Button theme={theme} onClick={() => handleAbsolute()}
                value="±" />
              <Button theme={theme} onClick={() => addNumber("0")} value="0" />
              <Button theme={theme} onClick={() => makeDecimal()}
                value="." />
            </div>
            <div>
              <div className='flex flex-col gap-2 font-bold'>
                <Button theme={theme} onClick={() => {
                  handleOperator("÷")
                }} value="÷" />
                <Button theme={theme} onClick={() => {
                  handleOperator("x")
                }} value="X" />
                <Button theme={theme} onClick={() => {
                  handleOperator("-")
                }} value="—" />
                <Button theme={theme} onClick={() => {
                  handleOperator("+")
                }} value="+" />
                <Button theme={theme} onClick={() => {
                  // calculate the result
                  if (!operator) {
                    return
                  }

                  if (leftValue && rightValue && result) {
                    return
                  }

                  const left = parseFloat(leftValue)
                  const right = parseFloat(inputValue)
                  let res = null
                  switch (operator) {
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
                    leftValue: leftValue,
                    operator: operator,
                    rightValue: inputValue,
                    result: res
                  }])
                  setResult(res)
                  setRightValue(inputValue)
                  setInputValue(res)
                }} value="=" />
              </div>
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
                <div className='flex justify-between gap-2'>
                  <div className='p-3 cursor-pointer' onClick={() => setConversionTab('currency')}>Currency</div>
                  <div className='p-3 cursor-pointer' onClick={() => setConversionTab('crypto')}>Crypto</div>
                </div>
                {
                  conversionTab === "currency" && (
                    <div className='flex flex-col gap-2 px-3'>
                      {
                        conversion.map((item, index) => {
                          return (
                            <div key={index} className='flex justify-between items-center'>
                              <div className='text-sm'>
                                {item.currency}: {(item.rate * inputValue).toFixed(0)}
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
                              Rates for {inputValue} {crypto}:
                            </div>
                            <div className='flex flex-col gap-2'>
                              {
                                Object.keys(cryptoRates).map((item, index) => {
                                  return (
                                    <div key={index} className='flex justify-between items-center'>
                                      <div className='text-sm'>
                                        {item}: {(cryptoRates[item] * inputValue).toFixed(0)}
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
