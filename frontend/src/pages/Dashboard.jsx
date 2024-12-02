import { useState } from "react"
import { useSelector } from "react-redux"
import { FileUpload } from "../components/ui/file-upload"
import { Button } from "../components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table"
import { Spinner } from "../components/ui/spinner"

function Dashboard() {
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useSelector((state) => state.auth)

  const handleFileUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:5000/api/files/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

 

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze file")
      }

if(data.analysis){
     
      setAnalysis(data.analysis)
}
    } catch (err) {
      setError(err.message)
      
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  console.log(analysis)
  const renderCustomersTable = (customers) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer, index) => (
          <TableRow key={index}>
            <TableCell>{customer.names}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.addresses}</TableCell>
            <TableCell>{customer.contactDetails}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderInvoicesTable = (invoices) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice Number</TableHead>
          <TableHead>Date</TableHead>
           <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, index) => (
          <TableRow key={index}>
            <TableCell>{invoice.invoiceNumbers}</TableCell>
            <TableCell>{invoice.dates}</TableCell>
            <TableCell>${invoice.amounts}</TableCell>
            <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice.paymentTerms?.map((item)=>item)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderProductsTable = (products) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.items.map((product, index) => (
          <TableRow key={index}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>${product.price}</TableCell>
            <TableCell>{parseInt(product.quantity)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Document Analysis Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Upload Document</h2>
            <FileUpload onFileSelect={setFile} />

            {file && (
              <div className="mt-4">
                <Button
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Spinner className="mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Document"
                  )}
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
                {error}
              </div>
            )}

            {analysis && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Analysis Results</h3>
                <Tabs defaultValue="customers">
                  <TabsList className="w-full">
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="products">Products</TabsTrigger>
                  </TabsList>
                  <TabsContent value="customers">
                    {renderCustomersTable(analysis.customers)}
                  </TabsContent>
                  <TabsContent value="invoices">
                    {renderInvoicesTable(analysis.invoices)}
                  </TabsContent>
                  <TabsContent value="products">
                    {renderProductsTable(analysis.products)}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard 