import { useState } from "react";
import { Accordion, Alert, Avatar, BarChart, Breadcrumb, Button, ButtonGroup, Card, Checkbox, Chip, Column, DatePicker, Divider, DoughnutChart, DropdownMenu, FileUpload, Grid, IconButton, Input, LineChart, MultiSelect, Pagination, PieChart, PolarAreaChart, Popover, ProgressBar, RadarChart, Radio, Rating, Row, Select, Skeleton, Slider, Spinner, Stepper, Table, Tabs, Textarea, Toggle, Tooltip } from "react-multistyle-ui";

export default function GeneratedPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFruit, setSelectedFruit] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [bio, setBio] = useState("");
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [planA, setPlanA] = useState("");
  const [planB, setPlanB] = useState("");
  const [volume, setVolume] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [buttongroup, setButtongroup] = useState("");
  const [rating, setRating] = useState(0);
  const [tabs, setTabs] = useState(0);
  const [pagination, setPagination] = useState(0);
  const [popover, setPopover] = useState(false);
  return (
    <>
  <Card>
    <Row>
      <Input label="Username" placeholder="Enter name" value={username} onValueChange={setUsername} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Input label="Email" placeholder="Enter email" value={email} onValueChange={setEmail} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Button label="Submit" />
    </Row>
  </Card>
  <Card>
    <Row>
      <Select placeholder="Fruit" options={[{value:"apple",label:"Apple"},{value:"banana",label:"Banana"},{value:"cherry",label:"Cherry"}]} value={selectedFruit} onValueChange={setSelectedFruit} />
    </Row>
  </Card>
  <Card>
    <Row>
      <MultiSelect placeholder="Hobbies" options={[{value:"reading",label:"Reading"},{value:"traveling",label:"Traveling"},{value:"cooking",label:"Cooking"}]} selected={selectedHobbies} onSelectedChange={setSelectedHobbies} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Textarea label="Bio" placeholder="Tell us about yourself" rows={4} value={bio} onValueChange={setBio} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Checkbox label="Subscribe to newsletter" checked={subscribeToNewsletter} onCheckedChange={setSubscribeToNewsletter} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Toggle label="Enable notifications" checked={enableNotifications} onCheckedChange={setEnableNotifications} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Radio label="Plan A" value="plan-a" group={planA} onGroupChange={setPlanA} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Radio label="Plan B" value="plan-b" group={planB} onGroupChange={setPlanB} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Slider label="Volume" min={0} max={100} value={volume} onValueChange={setVolume} />
    </Row>
  </Card>
  <Card>
    <Row>
      <DatePicker label="Start date" value={startDate} onValueChange={setStartDate} />
    </Row>
  </Card>
  <Card>
    <Row>
      <FileUpload label="Upload resume" />
    </Row>
  </Card>
  <Card>
    <Row>
      <ButtonGroup items={[{value:"grid",label:"Grid"},{value:"list",label:"List"}]} value={buttongroup} onValueChange={setButtongroup} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Rating max={5} value={rating} onValueChange={setRating} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Chip>
        Tag
      </Chip>
    </Row>
  </Card>
  <Card>
    <Row>
      <IconButton icon="search" ariaLabel="Search" />
    </Row>
  </Card>
  <Card>
    <Row>
      <Tabs tabs={[{id:"home",label:"Home"},{id:"profile",label:"Profile"}]} active={tabs} onActiveChange={setTabs} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Breadcrumb items={[{label:"Home",href:"/"},{label:"Products"},{label:"Details"}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Stepper steps={[{label:"Cart"},{label:"Shipping"},{label:"Payment"}]} current={1} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Pagination total={100} perPage={10} current={pagination} onCurrentChange={setPagination} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Accordion items={[{id:"faq-1",title:"What is this?",content:"A multi-style UI library."},{id:"faq-2",title:"How do I use it?",content:"Import components and pick a style."}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <DropdownMenu items={[{label:"Edit"},{label:"Delete"},{divider:true},{label:"Share"}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Tooltip>
        Info
      </Tooltip>
    </Row>
  </Card>
  <Card>
    <Row>
      <Popover open={popover} onOpenChange={setPopover} content="Popover body">
        Trigger
      </Popover>
    </Row>
  </Card>
  <Card>
    <Row>
      <Alert preset="success" title="Done">
        Your changes were saved.
      </Alert>
    </Row>
  </Card>
  <Card>
    <Row>
      <ProgressBar value={60} />
    </Row>
  </Card>
  <Card>
    <Row>
      <Spinner />
    </Row>
  </Card>
  <Card>
    <Row>
      <Skeleton />
    </Row>
  </Card>
  <Card>
    <Row>
      <Divider />
    </Row>
  </Card>
  <Card>
    <Row>
      <Avatar src="" fallback="JD" />
    </Row>
  </Card>
  <Card>
    <Row>
      <Grid columns={2}>
        Grid cell
      </Grid>
    </Row>
  </Card>
  <Card>
    <Row>
      <Column>
        Column cell
      </Column>
    </Row>
  </Card>
  <Card>
    <Row>
      <Table data={[{id:1,name:"Alice",role:"Admin"},{id:2,name:"Bob",role:"User"},{id:3,name:"Cara",role:"Editor"}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <BarChart title="Quarterly Revenue" xAxisLabel="Quarter" yAxisLabel="Revenue" downloadable={true} data={[{label:"q1",value:12},{label:"q2",value:19},{label:"q3",value:8},{label:"q4",value:15}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <LineChart title="Trend" data={[{label:"q1",value:12},{label:"q2",value:19},{label:"q3",value:8},{label:"q4",value:15}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <PieChart title="Share" data={[{label:"q1",value:12},{label:"q2",value:19},{label:"q3",value:8},{label:"q4",value:15}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <DoughnutChart title="Distribution" data={[{label:"q1",value:12},{label:"q2",value:19},{label:"q3",value:8},{label:"q4",value:15}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <RadarChart title="Radar" data={[{label:"q1",value:12},{label:"q2",value:19},{label:"q3",value:8},{label:"q4",value:15}]} />
    </Row>
  </Card>
  <Card>
    <Row>
      <PolarAreaChart title="Polar" data={[{label:"q1",value:12},{label:"q2",value:19},{label:"q3",value:8},{label:"q4",value:15}]} />
    </Row>
  </Card>
    </>
  );
}
