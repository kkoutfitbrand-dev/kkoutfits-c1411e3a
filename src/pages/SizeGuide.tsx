import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Size Guide</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Find your perfect fit with our comprehensive size guide
        </p>

        <Tabs defaultValue="kurta" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kurta">Kurta</TabsTrigger>
            <TabsTrigger value="sherwani">Sherwani</TabsTrigger>
            <TabsTrigger value="bandhgala">Bandhgala</TabsTrigger>
          </TabsList>

          <TabsContent value="kurta">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Kurta Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Size</th>
                      <th className="p-3 text-left">Chest (inches)</th>
                      <th className="p-3 text-left">Waist (inches)</th>
                      <th className="p-3 text-left">Length (inches)</th>
                      <th className="p-3 text-left">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium">S</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">30-32</td>
                      <td className="p-3">42</td>
                      <td className="p-3">16</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">M</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">32-34</td>
                      <td className="p-3">43</td>
                      <td className="p-3">17</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">L</td>
                      <td className="p-3">40-42</td>
                      <td className="p-3">34-36</td>
                      <td className="p-3">44</td>
                      <td className="p-3">18</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XL</td>
                      <td className="p-3">42-44</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">45</td>
                      <td className="p-3">19</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XXL</td>
                      <td className="p-3">44-46</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">46</td>
                      <td className="p-3">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sherwani">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Sherwani Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Size</th>
                      <th className="p-3 text-left">Chest (inches)</th>
                      <th className="p-3 text-left">Waist (inches)</th>
                      <th className="p-3 text-left">Length (inches)</th>
                      <th className="p-3 text-left">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium">S</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">30-32</td>
                      <td className="p-3">48</td>
                      <td className="p-3">16</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">M</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">32-34</td>
                      <td className="p-3">49</td>
                      <td className="p-3">17</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">L</td>
                      <td className="p-3">40-42</td>
                      <td className="p-3">34-36</td>
                      <td className="p-3">50</td>
                      <td className="p-3">18</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XL</td>
                      <td className="p-3">42-44</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">51</td>
                      <td className="p-3">19</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XXL</td>
                      <td className="p-3">44-46</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">52</td>
                      <td className="p-3">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bandhgala">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Bandhgala Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Size</th>
                      <th className="p-3 text-left">Chest (inches)</th>
                      <th className="p-3 text-left">Waist (inches)</th>
                      <th className="p-3 text-left">Length (inches)</th>
                      <th className="p-3 text-left">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium">S</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">30-32</td>
                      <td className="p-3">30</td>
                      <td className="p-3">16</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">M</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">32-34</td>
                      <td className="p-3">31</td>
                      <td className="p-3">17</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">L</td>
                      <td className="p-3">40-42</td>
                      <td className="p-3">34-36</td>
                      <td className="p-3">32</td>
                      <td className="p-3">18</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XL</td>
                      <td className="p-3">42-44</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">33</td>
                      <td className="p-3">19</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XXL</td>
                      <td className="p-3">44-46</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">34</td>
                      <td className="p-3">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* How to Measure */}
        <div className="mt-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-serif font-bold mb-6">How to Measure</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">1. Chest</h3>
              <p className="text-muted-foreground mb-4">
                Measure around the fullest part of your chest, keeping the tape horizontal.
              </p>
              
              <h3 className="font-semibold mb-3">2. Waist</h3>
              <p className="text-muted-foreground mb-4">
                Measure around your natural waistline, keeping the tape comfortably loose.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">3. Shoulder</h3>
              <p className="text-muted-foreground mb-4">
                Measure from one shoulder edge to the other across the back.
              </p>
              
              <h3 className="font-semibold mb-3">4. Length</h3>
              <p className="text-muted-foreground mb-4">
                Measure from the shoulder seam to the desired length of the garment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SizeGuide;
