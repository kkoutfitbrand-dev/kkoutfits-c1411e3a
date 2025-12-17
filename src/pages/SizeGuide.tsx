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

        <Tabs defaultValue="shirt" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shirt">Shirt</TabsTrigger>
            <TabsTrigger value="tshirt">T-Shirt</TabsTrigger>
            <TabsTrigger value="pant">Pant</TabsTrigger>
            <TabsTrigger value="chudidar">Chudidar</TabsTrigger>
          </TabsList>

          <TabsContent value="shirt">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Shirt Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Size</th>
                      <th className="p-3 text-left">Chest (inches)</th>
                      <th className="p-3 text-left">Neck (inches)</th>
                      <th className="p-3 text-left">Sleeve (inches)</th>
                      <th className="p-3 text-left">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium">S</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">14-14.5</td>
                      <td className="p-3">32</td>
                      <td className="p-3">16</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">M</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">15-15.5</td>
                      <td className="p-3">33</td>
                      <td className="p-3">17</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">L</td>
                      <td className="p-3">40-42</td>
                      <td className="p-3">16-16.5</td>
                      <td className="p-3">34</td>
                      <td className="p-3">18</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XL</td>
                      <td className="p-3">42-44</td>
                      <td className="p-3">17-17.5</td>
                      <td className="p-3">35</td>
                      <td className="p-3">19</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XXL</td>
                      <td className="p-3">44-46</td>
                      <td className="p-3">18-18.5</td>
                      <td className="p-3">36</td>
                      <td className="p-3">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tshirt">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">T-Shirt Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Size</th>
                      <th className="p-3 text-left">Chest (inches)</th>
                      <th className="p-3 text-left">Length (inches)</th>
                      <th className="p-3 text-left">Sleeve (inches)</th>
                      <th className="p-3 text-left">Shoulder (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium">S</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">26</td>
                      <td className="p-3">8</td>
                      <td className="p-3">16</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">M</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">27</td>
                      <td className="p-3">8.5</td>
                      <td className="p-3">17</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">L</td>
                      <td className="p-3">40-42</td>
                      <td className="p-3">28</td>
                      <td className="p-3">9</td>
                      <td className="p-3">18</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XL</td>
                      <td className="p-3">42-44</td>
                      <td className="p-3">29</td>
                      <td className="p-3">9.5</td>
                      <td className="p-3">19</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XXL</td>
                      <td className="p-3">44-46</td>
                      <td className="p-3">30</td>
                      <td className="p-3">10</td>
                      <td className="p-3">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pant">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Pant Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Size</th>
                      <th className="p-3 text-left">Waist (inches)</th>
                      <th className="p-3 text-left">Hip (inches)</th>
                      <th className="p-3 text-left">Inseam (inches)</th>
                      <th className="p-3 text-left">Length (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium">28</td>
                      <td className="p-3">28-29</td>
                      <td className="p-3">36</td>
                      <td className="p-3">30</td>
                      <td className="p-3">40</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">30</td>
                      <td className="p-3">30-31</td>
                      <td className="p-3">38</td>
                      <td className="p-3">31</td>
                      <td className="p-3">41</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">32</td>
                      <td className="p-3">32-33</td>
                      <td className="p-3">40</td>
                      <td className="p-3">32</td>
                      <td className="p-3">42</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">34</td>
                      <td className="p-3">34-35</td>
                      <td className="p-3">42</td>
                      <td className="p-3">32</td>
                      <td className="p-3">42</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">36</td>
                      <td className="p-3">36-37</td>
                      <td className="p-3">44</td>
                      <td className="p-3">33</td>
                      <td className="p-3">43</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chudidar">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold mb-6">Chudidar Size Chart</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Size</th>
                      <th className="p-3 text-left">Waist (inches)</th>
                      <th className="p-3 text-left">Hip (inches)</th>
                      <th className="p-3 text-left">Length (inches)</th>
                      <th className="p-3 text-left">Bottom (inches)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-3 font-medium">S</td>
                      <td className="p-3">26-28</td>
                      <td className="p-3">34-36</td>
                      <td className="p-3">38</td>
                      <td className="p-3">5</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">M</td>
                      <td className="p-3">28-30</td>
                      <td className="p-3">36-38</td>
                      <td className="p-3">39</td>
                      <td className="p-3">5.5</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">L</td>
                      <td className="p-3">30-32</td>
                      <td className="p-3">38-40</td>
                      <td className="p-3">40</td>
                      <td className="p-3">6</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XL</td>
                      <td className="p-3">32-34</td>
                      <td className="p-3">40-42</td>
                      <td className="p-3">41</td>
                      <td className="p-3">6.5</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">XXL</td>
                      <td className="p-3">34-36</td>
                      <td className="p-3">42-44</td>
                      <td className="p-3">42</td>
                      <td className="p-3">7</td>
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
