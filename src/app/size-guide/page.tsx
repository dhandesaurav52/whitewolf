
import { Metadata } from "next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: 'Size Guide | White Wolf',
  description: 'Find your perfect fit with our detailed size guide for all our products.',
};

export default function SizeGuidePage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-12 text-center">
            Size Guide
          </h1>
          <div className="space-y-16 text-base md:text-lg text-muted-foreground leading-relaxed">
            
            {/* T-Shirt Section */}
            <div>
              <h2 className="text-3xl font-bold font-headline text-accent mb-4">👕 Men's T-Shirt Size Guide (India)</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Chest (inches)</TableHead>
                    <TableHead>Length (inches)</TableHead>
                    <TableHead>Shoulder (inches)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>S</TableCell><TableCell>36–38</TableCell><TableCell>26–27</TableCell><TableCell>16–17</TableCell></TableRow>
                  <TableRow><TableCell>M</TableCell><TableCell>38–40</TableCell><TableCell>27–28</TableCell><TableCell>17–18</TableCell></TableRow>
                  <TableRow><TableCell>L</TableCell><TableCell>40–42</TableCell><TableCell>28–29</TableCell><TableCell>18–19</TableCell></TableRow>
                  <TableRow><TableCell>XL</TableCell><TableCell>42–44</TableCell><TableCell>29–30</TableCell><TableCell>19–20</TableCell></TableRow>
                  <TableRow><TableCell>XXL</TableCell><TableCell>44–46</TableCell><TableCell>30–31</TableCell><TableCell>20–21</TableCell></TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-primary">✅ Tips:</h3>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                  <li>Slim fit may run tighter on the chest.</li>
                  <li>Suggest customers measure their favorite T-shirt for a perfect comparison.</li>
                </ul>
              </div>
            </div>

            {/* Shirt Section */}
            <div>
              <h2 className="text-3xl font-bold font-headline text-accent mb-4">👔 Men's Shirt Size Guide (India)</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Collar (in)</TableHead>
                    <TableHead>Chest (in)</TableHead>
                    <TableHead>Waist (in)</TableHead>
                    <TableHead>Sleeve Length (in)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>38 (S)</TableCell><TableCell>15</TableCell><TableCell>38</TableCell><TableCell>34</TableCell><TableCell>24.5</TableCell></TableRow>
                  <TableRow><TableCell>39 (M)</TableCell><TableCell>15.5</TableCell><TableCell>40</TableCell><TableCell>36</TableCell><TableCell>25</TableCell></TableRow>
                  <TableRow><TableCell>40 (L)</TableCell><TableCell>16</TableCell><TableCell>42</TableCell><TableCell>38</TableCell><TableCell>25.5</TableCell></TableRow>
                  <TableRow><TableCell>42 (XL)</TableCell><TableCell>16.5</TableCell><TableCell>44</TableCell><TableCell>40</TableCell><TableCell>26</TableCell></TableRow>
                  <TableRow><TableCell>44 (XXL)</TableCell><TableCell>17</TableCell><TableCell>46</TableCell><TableCell>42</TableCell><TableCell>26.5</TableCell></TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-primary">✅ Tips:</h3>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                    <li>Indian shirt sizes often go by collar size in centimeters too (38, 39, etc.).</li>
                    <li>Allow for 1–2 inches of room for movement in formal shirts.</li>
                </ul>
              </div>
            </div>

            {/* Jeans Section */}
            <div>
              <h2 className="text-3xl font-bold font-headline text-accent mb-4">👖 Men’s Jeans Size Guide (India)</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waist Size (in)</TableHead>
                    <TableHead>Waist (cm)</TableHead>
                    <TableHead>Hips (in)</TableHead>
                    <TableHead>Length (inseam)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>28</TableCell><TableCell>71</TableCell><TableCell>34–35</TableCell><TableCell>30–32</TableCell></TableRow>
                  <TableRow><TableCell>30</TableCell><TableCell>76</TableCell><TableCell>36–37</TableCell><TableCell>30–32</TableCell></TableRow>
                  <TableRow><TableCell>32</TableCell><TableCell>81</TableCell><TableCell>38–39</TableCell><TableCell>31–33</TableCell></TableRow>
                  <TableRow><TableCell>34</TableCell><TableCell>86</TableCell><TableCell>40–41</TableCell><TableCell>31–33</TableCell></TableRow>
                  <TableRow><TableCell>36</TableCell><TableCell>91</TableCell><TableCell>42–43</TableCell><TableCell>31–34</TableCell></TableRow>
                  <TableRow><TableCell>38</TableCell><TableCell>96</TableCell><TableCell>44–45</TableCell><TableCell>32–34</TableCell></TableRow>
                  <TableRow><TableCell>40</TableCell><TableCell>101</TableCell><TableCell>46–47</TableCell><TableCell>32–35</TableCell></TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-primary">✅ Fit Types:</h3>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                    <li><span className="font-semibold">Slim Fit:</span> Snug from waist to ankle</li>
                    <li><span className="font-semibold">Regular Fit:</span> Straight cut</li>
                    <li><span className="font-semibold">Relaxed Fit:</span> More room in thigh/hip</li>
                </ul>
              </div>
            </div>

            {/* Footwear Section */}
            <div>
              <h2 className="text-3xl font-bold font-headline text-accent mb-4">👟 Men's Footwear Size Guide (India to UK/US)</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>India Size</TableHead>
                    <TableHead>UK Size</TableHead>
                    <TableHead>US Size</TableHead>
                    <TableHead>Foot Length (cm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>6</TableCell><TableCell>6</TableCell><TableCell>7</TableCell><TableCell>24.5</TableCell></TableRow>
                  <TableRow><TableCell>7</TableCell><TableCell>7</TableCell><TableCell>8</TableCell><TableCell>25.4</TableCell></TableRow>
                  <TableRow><TableCell>8</TableCell><TableCell>8</TableCell><TableCell>9</TableCell><TableCell>26.3</TableCell></TableRow>
                  <TableRow><TableCell>9</TableCell><TableCell>9</TableCell><TableCell>10</TableCell><TableCell>27.1</TableCell></TableRow>
                  <TableRow><TableCell>10</TableCell><TableCell>10</TableCell><TableCell>11</TableCell><TableCell>27.9</TableCell></TableRow>
                  <TableRow><TableCell>11</TableCell><TableCell>11</TableCell><TableCell>12</TableCell><TableCell>28.8</TableCell></TableRow>
                  <TableRow><TableCell>12</TableCell><TableCell>12</TableCell><TableCell>13</TableCell><TableCell>29.6</TableCell></TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-primary">✅ How to Measure:</h3>
                <ul className="list-disc list-inside mt-2 text-muted-foreground">
                    <li>Place foot on paper, draw outline, measure heel to toe.</li>
                    <li>Always round up if in between sizes.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
