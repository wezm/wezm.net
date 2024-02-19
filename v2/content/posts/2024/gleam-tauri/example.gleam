import gleam/io
import gleam/list
import gleam/int

pub type Temperature {
  F(Float)
  C(Float)
}

pub type Celcius {
  Celcius(Float)
}

pub fn main() {
  let temps = [C(22.0), C(-5.0), F(0.0), C(0.0), F(32.0)]
  io.debug(avg(temps))
}

pub fn avg(measurements: List(Temperature)) -> Celcius {
  let sum =
    list.fold(measurements, 0.0, fn(sum, val) {
      let Celcius(c) = to_c(val)
      sum +. c
    })
  let length =
    list.length(measurements)
    |> int.to_float
  Celcius(sum /. length)
}

fn to_c(temp: Temperature) -> Celcius {
  case temp {
    C(c) -> Celcius(c)
    F(f) -> Celcius({ f -. 32.0 } /. 1.8)
  }
}

