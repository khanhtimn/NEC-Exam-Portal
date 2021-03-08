import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TestForm from "./TestForm";
import QuestionForm from "./QuestionForm";
import RulesForm from "./RulesForm";
import Review from "./Review";
import { createTest } from "../../actions/actions";
import uuid from "uuid/dist/v4";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  errorMsg: {
    color: "red",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ["Test details", "Questions", "Rules", "Review"];

function getStepContent(
  step,
  id,
  name,
  marks,
  duration,
  durationHrs,
  durationMins,
  dueDate,
  questions,
  rules,
  setName,
  setMarks,
  setDurationHrs,
  setDurationMins,
  setDueDate,
  setQuestions,
  setRules
) {
  switch (step) {
    case 0:
      return (
        <TestForm
          name={name}
          setName={setName}
          marks={marks}
          setMarks={setMarks}
          durationHrs={durationHrs}
          durationMins={durationMins}
          setDurationHrs={setDurationHrs}
          setDurationMins={setDurationMins}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />
      );
    case 1:
      return <QuestionForm questions={questions} setQuestions={setQuestions} id = {id}/>;
    case 2:
      return <RulesForm rules={rules} setRules={setRules} />;
    case 3:
      return (
        <Review
          name={name}
          marks={marks}
          duration={duration}
          dueDate={dueDate}
          questions={questions}
          rules={rules}
        />
      );
    default:
      throw new Error("Unknown step");
  }
}
const id = uuid();
export default function CreateTest(porps) {
  const classes = useStyles();
  const { classCode } = porps.match.params;
  const [activeStep, setActiveStep] = React.useState(0);
  const [name, setName] = React.useState("");
  const [dueDate, setDueDate] = React.useState(new Date());
  const [durationHrs, setDurationHrs] = React.useState(0);
  const [durationMins, setDurationMins] = React.useState(0);
  const [duration, setDuration] = React.useState(Date.now());
  const [marks, setMarks] = React.useState(0);
  const [error, setError] = React.useState("");
  const [questions, setQuestions] = React.useState([
    {
      question: "",
      type: 1,
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      answer: "",
      test: id,
    },
  ]);
  const [rules, setRules] = React.useState([
    { type: 1, marks: 0, noofques: 0 },
  ]);

  const handleNext = () => {
    if (!name && !marks && durationMins < 10 && durationHrs < 0) {
      setError("Please provide test name, marks and duration");
      return;
    } else if (!marks) {
      setError("Please provide marks");
      return;
    } else if (!name) {
      setError("Please provide test name");
      return;
    } else if (durationMins < 10 && durationHrs < 0) {
      setError("Please provide test duration");
      return;
    }

    setError("");
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = () => {
    var d = new Date(98,1);
    console.log("Date "+d); 
    d.setHours(durationHrs);
    d.setMinutes(durationMins);
    console.log("Date "+d); 
    const newTest = {
      id: id,
      name: name,
      classroom: classCode,
      marks: marks,
      questions: questions,
      rules: rules,
      duration: d,
      dueDate: dueDate,
    };
    console.log(newTest);
    createTest(newTest);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h1' variant='h4' align='center'>
            Create Test
          </Typography>

          <React.Fragment>
            <React.Fragment>
              {getStepContent(
                activeStep,
                id,
                name,
                marks,
                duration,
                durationHrs,
                durationMins,
                dueDate,
                questions,
                rules,
                setName,
                setMarks,
                setDurationHrs,
                setDurationMins,
                setDueDate,
                setQuestions,
                setRules
              )}
              <p className={classes.errorMsg}>{error}</p>
              <div className={classes.buttons}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                )}
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                    className={classes.button}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleNext}
                    className={classes.button}
                  >
                    Next
                  </Button>
                )}
              </div>
            </React.Fragment>
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}
